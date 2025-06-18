const container = document.querySelector('.container');
const registerBtns = document.querySelectorAll('.register-btn');
const loginBtns = document.querySelectorAll('.login-btn, .signIn-link');

registerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('active');
    });
});

loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('active');
    });
});

// --- FORM REGISTRASI DENGAN TAMPILAN ERROR SPESIFIK ---
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Sembunyikan semua pesan error lama pada form registrasi
        document.querySelectorAll('#registerForm .error-message').forEach(el => el.style.display = 'none');

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validasi frontend sederhana untuk konfirmasi password
        if (password !== confirmPassword) {
            const errorElement = document.getElementById('error-confirmPassword');
            errorElement.textContent = "Password tidak cocok!";
            errorElement.style.display = 'block';
            return;
        }

        const formData = { username, email, password };

        try {
            const response = await fetch('https://projectpalugada.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const resultText = await response.text();
                alert(resultText || "Registrasi berhasil!");
                document.querySelector('.login-btn').click(); // Pindah ke form login
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    errorData.errors.forEach(err => {
                        // `err.path` akan berisi 'username', 'email', atau 'password' dari backend
                        const errorElement = document.getElementById(`error-${err.path}`);
                        if (errorElement) {
                            errorElement.textContent = err.msg;
                            errorElement.style.display = 'block';
                        } else {
                            // Untuk error umum (seperti duplikat)
                            alert(err.msg);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat registrasi:', error);
            alert('Tidak dapat terhubung ke server registrasi.');
        }
    });
}


// --- LOGIKA LOGIN DENGAN TAMPILAN ERROR SPESIFIK ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorLoginElement = document.getElementById('error-login');
        errorLoginElement.style.display = 'none'; // Sembunyikan error lama

        const usernameOrEmail = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const formData = {
            username: usernameOrEmail,
            password: password
        };

        try {
            const response = await fetch('https://projectpalugada.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Login berhasil!');
                localStorage.setItem('token', result.token);
                window.location.href = '../index.html';
            } else {
                // Tampilkan pesan error di dalam form, bukan alert
                errorLoginElement.textContent = result.message || 'Password Atau Username Salah';
                errorLoginElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat login:', error);
            // Tampilkan error koneksi di dalam form
            errorLoginElement.textContent = 'Tidak dapat terhubung ke server.';
            errorLoginElement.style.display = 'block';
        }
    });
}