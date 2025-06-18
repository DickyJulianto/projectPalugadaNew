// --- LOGIKA LOGIN DENGAN TAMPILAN ERROR LEBIH BAIK ---
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Sembunyikan pesan error lama
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login berhasil!');
            localStorage.setItem('token', result.token);
            window.location.href = '../index.html';
        } else {
            // Tampilkan pesan error dari server di form
            errorLoginElement.textContent = result.message || 'Kredensial tidak valid';
            errorLoginElement.style.display = 'block';
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat login:', error);
        errorLoginElement.textContent = 'Tidak dapat terhubung ke server.';
        errorLoginElement.style.display = 'block';
    }
});