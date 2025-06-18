const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelectorAll('.login-btn, .signIn-link'); // Memilih kedua tombol login

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah link # refresh halaman
        container.classList.remove('active');
    });
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

    const formData = {
        username: username,
        email: email,
        password: password
    };

    try {
        // PERBAIKAN: URL API menuju endpoint /register
        const response = await fetch('https://projectpalugada.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const resultText = await response.text();
            alert(resultText || "Registrasi berhasil!");
            // Otomatis pindah ke form login setelah registrasi sukses
            document.querySelector('.login-btn').click();
        } else {
            // Menangani error dari backend
            const errorData = await response.json();
            // Menampilkan error validasi pertama yang ditemukan
            alert('Error: ' + (errorData.errors ? errorData.errors[0].msg : 'Registrasi gagal.'));
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
    }
});


// --- LOGIKA LOGIN ---
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameOrEmail = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // PERBAIKAN: Pastikan mengirim "username" karena itu yang diharapkan backend
    const formData = {
        username: usernameOrEmail,
        password: password
    };

    try {
        // PERBAIKAN: URL API menuju endpoint /login
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
            window.location.href = '../index.html'; // Sesuaikan path jika perlu
        } else {
            alert('Error: ' + (result.message || 'Kredensial tidak valid'));
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server.');
    }
});