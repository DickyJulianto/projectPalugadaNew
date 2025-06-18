const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// --- FORM REGISTRASI DENGAN TAMPILAN ERROR LEBIH BAIK ---
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Sembunyikan semua pesan error lama
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validasi frontend sederhana
    if (password !== confirmPassword) {
        document.getElementById('error-confirmPassword').textContent = "Password tidak cocok!";
        document.getElementById('error-confirmPassword').style.display = 'block';
        return;
    }

    const formData = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch('https://projectpalugada.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const resultText = await response.text();
            alert(resultText);
            loginBtn.click();
        } else {
            // Jika gagal, tangani error dari server
            const errorData = await response.json();
            if (errorData.errors) {
                errorData.errors.forEach(err => {
                    // Tampilkan setiap pesan error di bawah input yang sesuai
                    const errorElement = document.getElementById(`error-${err.path || 'confirmPassword'}`);
                    if (errorElement) {
                        errorElement.textContent = err.msg;
                        errorElement.style.display = 'block';
                    }
                });
            }
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat registrasi:', error);
        alert('Tidak dapat terhubung ke server registrasi.');
    }
});


// --- LOGIKA LOGIN ---
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Di backend, kita sudah atur agar bisa menerima username atau email
    const usernameOrEmail = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Backend mengharapkan field 'username', jadi kita kirim input sebagai username
    const formData = {
        username: usernameOrEmail,
        password: password
    };

    try {
        // Pastikan endpointnya adalah '/login'
        const response = await fetch('https://projectpalugada.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login berhasil!');
            localStorage.setItem('token', result.token);
            window.location.href = '../index.html'; // Arahkan ke halaman utama setelah login
        } else {
            alert('Error: ' + (result.message || 'Kredensial tidak valid'));
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat login:', error);
        alert('Tidak dapat terhubung ke server login.');
    }
});