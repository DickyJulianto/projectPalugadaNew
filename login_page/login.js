const container = document.querySelector('.container');
// Memperbaiki selector agar semua tombol register/login berfungsi
const registerBtns = document.querySelectorAll('.register-btn, .signUp-link');
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


// --- FORM REGISTRASI ---
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.querySelectorAll('#registerForm .error-message').forEach(el => el.style.display = 'none');

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            const errorElement = document.getElementById('error-confirmPassword');
            errorElement.textContent = "Password dan konfirmasi password tidak cocok!";
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
                document.querySelector('.login-btn').click();
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    errorData.errors.forEach(err => {
                        const errorElement = document.getElementById(`error-${err.path}`);
                        if (errorElement) {
                            errorElement.textContent = err.msg;
                            errorElement.style.display = 'block';
                        } else {
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


// --- LOGIKA LOGIN ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorLoginElement = document.getElementById('error-login');
        errorLoginElement.style.display = 'none';

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

            // ===============================================
            // == PERBAIKAN SINTAKS ADA DI BLOK INI ==
            // ===============================================
            if (response.ok) {
                alert('Login berhasil!');
                // Simpan token DAN peran pengguna
                localStorage.setItem('token', result.token);
                localStorage.setItem('userRole', result.role);
                window.location.href = '../index.html';
            } else {
                // blok 'else' ini sekarang berada di dalam 'try'
                errorLoginElement.textContent = result.message || 'Kredensial tidak valid';
                errorLoginElement.style.display = 'block';
            }
            // ===============================================
            // == AKHIR DARI PERBAIKAN SINTAKS ==
            // ===============================================

        } catch (error) {
            console.error('Terjadi kesalahan saat login:', error);
            errorLoginElement.textContent = 'Tidak dapat terhubung ke server.';
            errorLoginElement.style.display = 'block';
        }
    });
}