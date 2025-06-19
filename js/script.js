document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');
    const adminPanelLink = document.getElementById('admin-panel-link');

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        // Jika ada token, berarti pengguna sudah login
        // 1. Ubah tombol Login menjadi Logout
        authButton.textContent = 'Logout';
        authButton.href = '#'; // Hapus link ke halaman login

        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hapus data dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            
            // Arahkan kembali ke halaman utama
            alert('Anda telah logout.');
            window.location.href = 'index.html';
        });

        // 2. Periksa peran pengguna
        if (userRole === 'admin' && adminPanelLink) {
            // Jika perannya 'admin', tampilkan tombol Admin Panel
            adminPanelLink.style.display = 'inline-block'; // atau 'block' sesuai style Anda
        }

    } else {
        // Jika tidak ada token, pastikan tombolnya adalah "Login"
        // dan link admin disembunyikan (ini sudah default, tapi untuk keamanan)
        authButton.textContent = 'Login';
        authButton.href = 'login_page/login.html';
        if (adminPanelLink) {
            adminPanelLink.style.display = 'none';
        }
    }
});