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

    const formData = {
        username: username,
        email: email,
        password: password
    };

    try {
        // PERBAIKAN: Menambahkan endpoint /register
        const response = await fetch('https://projectpalugada.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const resultText = await response.text();
        if (response.ok) {
            alert(resultText); // Menampilkan pesan sukses dari server
            loginBtn.click(); // Pindah ke tampilan login
        } else {
            // Jika ada pesan error dari server dalam format JSON
            try {
                const resultJson = JSON.parse(resultText);
                alert('Error: ' + resultJson.message);
            } catch {
                alert('Error: ' + resultText);
            }
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server registrasi. Silakan coba lagi nanti.');
    }
});

// --- LOGIKA LOGIN ---
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Mengirim username dan password. User bisa input username atau email di form.
    const usernameOrEmail = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = {
        username: usernameOrEmail, // Mengirim sebagai 'username' ke backend
        password: password
    };

    try {
        // PERBAIKAN: Menambahkan endpoint /login
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
            alert('Error: ' + (result.message || 'Kredensial tidak valid'));
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server login.');
    }
});