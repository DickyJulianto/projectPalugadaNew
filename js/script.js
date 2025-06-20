$(document).ready(function(){

    // === LOGIKA ASLI ANDA: NAVBAR SCROLL & HAMBURGER MENU ===

    $('.fas.fa-bars').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll', function(){
        $('.fas.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }
    });

    // === LOGIKA BARU: AUTENTIKASI, RBAC, DAN LOGOUT REDIRECT ===

    // Menargetkan tombol dengan ID yang benar
    const authButton = document.getElementById('login_button'); 
    const adminPanelLink = document.getElementById('admin-panel-link');

    if (authButton) {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (token) {
            // --- JIKA PENGGUNA SUDAH LOGIN ---
            
            authButton.textContent = 'Logout';
            authButton.href = '#'; // Hapus link agar tidak pindah halaman

            authButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Apakah Anda yakin ingin logout?')) {
                    // Hapus data sesi dari localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    
                    alert('Anda telah logout.');
                    // PERUBAHAN: Mengarahkan ke halaman login setelah logout
                    window.location.href = '/login_page/login.html'; 
                }
            });

            // Periksa peran (role) pengguna untuk menampilkan link admin
            if (userRole === 'admin' && adminPanelLink) {
                adminPanelLink.parentElement.style.display = 'list-item'; 
            }

        } else {
            // --- JIKA PENGGUNA BELUM LOGIN ---

            authButton.textContent = 'Login';
            authButton.href = '/login_page/login.html';
            
            if (adminPanelLink) {
                adminPanelLink.parentElement.style.display = 'none';
            }
        }
    }
});