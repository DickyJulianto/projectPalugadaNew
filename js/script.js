// jQuery untuk handle header
$(document).ready(function() {
    // Fungsi untuk toggle menu mobile
    $('.fa-bars').click(function() {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Fungsi untuk header sticky dan highlight navigasi
    $(window).on('scroll load', function() {
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }

        // Highlight menu yang aktif saat scroll
        $('section').each(function() {
            var id = $(this).attr('id');
            var height = $(this).height();
            var offset = $(this).offset().top - 200;
            var top = $(window).scrollTop();
            if (top >= offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });
});


// ===================================================================
// == PERBAIKAN LOGIKA TOMBOL LOGIN/LOGOUT DIMULAI DI SINI ==
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const adminPanelLink = document.getElementById('admin-panel-link');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        // --- KONDISI JIKA PENGGUNA SUDAH LOGIN ---

        // 1. Ubah tombol menjadi "Logout"
        authButton.textContent = 'Logout';
        authButton.href = '#'; // Hapus link ke halaman login

        // 2. Tambahkan fungsi logout saat tombol di-klik
        authButton.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah aksi default (pindah halaman)
            
            // Hapus token dan role dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            
            // Beri notifikasi dan refresh halaman
            alert('Anda telah berhasil logout.');
            window.location.reload();
        });

        // 3. Tampilkan link Admin Panel jika rolenya adalah 'admin'
        if (userRole === 'admin') {
            if(adminPanelLink) {
                adminPanelLink.style.display = 'block'; // Tampilkan link
            }
        }

    } else {
        // --- KONDISI JIKA PENGGUNA BELUM LOGIN ---
        
        // Tombol akan berfungsi sebagai link biasa ke halaman login
        // karena kita tidak menambahkan event listener apapun.
        // Link Admin Panel akan tetap tersembunyi (sesuai default CSS/HTML).
    }
});


// ===================================================================
// == AKHIR DARI PERBAIKAN LOGIKA TOMBOL LOGIN/LOGOUT ==
// ===================================================================


// --- LOGIKA UNTUK CONTACT FORM ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Validasi sederhana
        if (fullName && email && phone && message) {
            alert('Terima kasih! Pesan Anda telah terkirim.');
            contactForm.reset();
        } else {
            alert('Harap isi semua kolom yang tersedia.');
        }
    });
}