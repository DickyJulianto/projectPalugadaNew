// --- LOGIKA TOGGLE PANEL LOGIN & REGISTER ---
const container = document.querySelector('.container');
const registerBtns = document.querySelectorAll('.register-btn');
const loginBtns = document.querySelectorAll('.login-btn');

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

// ===============================================
// == POINT 4: FUNGSI TOGGLE PASSWORD --
// ===============================================
const togglePasswordIcons = document.querySelectorAll('.toggle-password');

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const passwordInput = icon.previousElementSibling;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bx-hide');
            icon.classList.add('bx-show');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bx-show');
            icon.classList.add('bx-hide');
        }
    });
});


// --- LOGIKA FORM REGISTRASI ---
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
                alert(resultText || "Registrasi berhasil! Silakan login.");
                // Otomatis pindah ke panel login setelah registrasi sukses
                document.querySelector('.login-btn').click(); 
                registerForm.reset();
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
                } else if(errorData.message) {
                    alert('Error: ' + errorData.message);
                }
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat registrasi:', error);
            alert('Tidak dapat terhubung ke server registrasi.');
        }
    });
}


// --- LOGIKA LOGIN (DENGAN RECAPTCHA) ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorLoginElement = document.getElementById('error-login');
        errorLoginElement.style.display = 'none';
        
        const recaptchaToken = grecaptcha.getResponse();

        if (!recaptchaToken) {
            errorLoginElement.textContent = 'Harap centang kotak "I\'m not a robot".';
            errorLoginElement.style.display = 'block';
            return;
        }

        const usernameOrEmail = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const formData = {
            username: usernameOrEmail,
            password: password,
            recaptchaToken: recaptchaToken 
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
                localStorage.setItem('userRole', result.role);
                window.location.href = '../index.html'; // Arahkan ke halaman utama setelah login
            } else {
                errorLoginElement.textContent = result.message || 'Kredensial tidak valid';
                errorLoginElement.style.display = 'block';
                grecaptcha.reset(); 
            }

        } catch (error) {
            console.error('Terjadi kesalahan saat login:', error);
            errorLoginElement.textContent = 'Tidak dapat terhubung ke server.';
            errorLoginElement.style.display = 'block';
            grecaptcha.reset();
        }
    });
}