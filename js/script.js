document.addEventListener('DOMContentLoaded', () => {
    // PERBAIKAN 1: Menggunakan ID 'login_button' sesuai dengan yang ada di index.html Anda
    const authButton = document.getElementById('login_button');
    const adminPanelLink = document.getElementById('admin-panel-link');

    // Cek apakah elemen tombol login ditemukan untuk menghindari error
    if (!authButton) {
        console.error('Elemen dengan ID "login_button" tidak ditemukan di HTML!');
        return;
    }

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        // --- JIKA PENGGUNA SUDAH LOGIN ---
        
        // 1. Ubah tombol menjadi "Logout"
        authButton.textContent = 'Logout';
        authButton.href = '#'; // Hapus link agar tidak pindah halaman saat diklik

        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Konfirmasi sebelum logout
            if (confirm('Apakah Anda yakin ingin logout?')) {
                // Hapus data sesi dari localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                
                alert('Anda telah logout.');
                window.location.reload(); // Muat ulang halaman agar tampilan kembali ke state "belum login"
            }
        });

        // 2. Periksa peran (role) pengguna
        if (userRole === 'admin' && adminPanelLink) {
            // PERBAIKAN 2: Tampilkan elemen <li> yang membungkus link, bukan hanya link-nya
            adminPanelLink.parentElement.style.display = 'list-item'; 
        }

    } else {
        // --- JIKA PENGGUNA BELUM LOGIN ---

        // Pastikan tombol adalah "Login" dan mengarah ke halaman yang benar
        authButton.textContent = 'Login';
        authButton.href = '/login_page/login.html';
        
        // Pastikan link admin tersembunyi dengan menyembunyikan elemen <li>-nya
        if (adminPanelLink) {
            adminPanelLink.parentElement.style.display = 'none';
        }
    }

    // Menambahkan fungsionalitas untuk menu hamburger di tampilan mobile
    const menuIcon = document.querySelector('.fas.fa-bars');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
});