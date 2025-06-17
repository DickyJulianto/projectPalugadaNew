const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// --- FORM REGISTRASI ---
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
    }

    // Pastikan data yang dikirim memiliki field 'username', 'email', dan 'password'
    const formData = {
        username: username,
        email: email,
        password: password
    };

    try {
        // Pastikan endpointnya adalah '/register'
        const response = await fetch('https://projectpalugada.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const resultText = await response.text();

        if (response.ok) {
            alert(resultText); // Menampilkan pesan sukses dari server
            loginBtn.click(); // Otomatis pindah ke tampilan login
        } else {
            // Coba parsing sebagai JSON dulu untuk pesan error yang lebih baik
            try {
                const resultJson = JSON.parse(resultText);
                alert('Error: ' + resultJson.message);
            } catch {
                alert('Error: ' + resultText); // Fallback jika pesan bukan JSON
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