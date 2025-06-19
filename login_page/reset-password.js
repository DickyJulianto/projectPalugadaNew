document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const messageElement = document.getElementById('message');

    // Ambil token dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        messageElement.textContent = 'Token tidak ditemukan. Silakan coba lagi dari link di email Anda.';
        messageElement.style.color = '#c0392b';
        messageElement.style.display = 'block';
        form.querySelector('button').disabled = true;
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitButton = form.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            messageElement.textContent = 'Password tidak cocok!';
            messageElement.style.color = '#c0392b';
            messageElement.style.display = 'block';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Resetting...';

        try {
            const response = await fetch('https://projectpalugada.onrender.com/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const resultText = await response.text();

            if (response.ok) {
                alert(resultText);
                // Arahkan ke halaman login setelah sukses
                window.location.href = 'login.html';
            } else {
                messageElement.textContent = JSON.parse(resultText).message || 'Gagal mereset password.';
                messageElement.style.color = '#c0392b';
                messageElement.style.display = 'block';
            }

        } catch (error) {
            console.error('Error:', error);
            messageElement.textContent = 'Terjadi kesalahan. Coba lagi nanti.';
            messageElement.style.color = '#c0392b';
            messageElement.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Reset Password';
        }
    });
});