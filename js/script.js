$(document).ready(function(){

    // ======================================================
    // == LOGIKA ASLI ANDA: NAVBAR SCROLL & HAMBURGER MENU ==
    // ======================================================

    // Fungsi untuk hamburger menu di tampilan mobile
    $('.fas.fa-bars').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Fungsi untuk header/navbar yang berubah saat di-scroll
    $(window).on('load scroll', function(){
        $('.fas.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }
    });

    // ======================================================
    // == LOGIKA BARU: AUTENTIKASI & ROLE-BASED ACCESS (RBAC) ==
    // ======================================================

    // Menjalankan kode ini setelah seluruh halaman dimuat
    const authButton = document.getElementById('login_button'); // Mencari ID yang benar
    const adminPanelLink = document.getElementById('admin-panel-link');

    // Cek apakah elemen-elemen tersebut ada sebelum melanjutkan
    if (authButton && adminPanelLink) {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (token) {
            // --- JIKA PENGGUNA SUDAH LOGIN ---
            
            // 1. Ubah tombol menjadi "Logout"
            authButton.textContent = 'Logout';
            authButton.href = '#'; // Hapus link agar tidak pindah halaman

            authButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Apakah Anda yakin ingin logout?')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    alert('Anda telah logout.');
                    window.location.reload(); // Muat ulang halaman
                }
            });

            // 2. Periksa peran (role) pengguna
            if (userRole === 'admin') {
                // Tampilkan elemen <li> yang membungkus link Admin Panel
                adminPanelLink.parentElement.style.display = 'list-item'; 
            }

        } else {
            // --- JIKA PENGGUNA BELUM LOGIN ---

            // Pastikan tombol adalah "Login" dan link admin tersembunyi
            authButton.textContent = 'Login';
            authButton.href = '/login_page/login.html';
            adminPanelLink.parentElement.style.display = 'none';
        }
    }
});