document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const email = document.getElementById('email').value;
    const messageElement = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Nonaktifkan tombol dan tampilkan pesan loading
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    messageElement.style.display = 'none';

    try {
        const response = await fetch('https://projectpalugada.onrender.com/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const resultText = await response.text();

        // Tampilkan pesan sukses dari server
        messageElement.textContent = resultText;
        messageElement.style.color = '#27ae60'; // Warna hijau untuk sukses
        messageElement.style.display = 'block';

        // Reset form setelah berhasil
        form.reset();

    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Tidak dapat terhubung ke server. Coba lagi nanti.';
        messageElement.style.color = '#c0392b'; // Warna merah untuk error
        messageElement.style.display = 'block';
    } finally {
        // Aktifkan kembali tombol
        submitButton.disabled = false;
        submitButton.textContent = 'Send Reset Link';
    }
});