//Document Ready
$(document).ready(function(){
    //Toggle Navigation Bar Functionality
    $('.fa-bars').click(function(){
        //Toggle 'fa-times' class on click
        $(this).toggleClass('fa-times');
        //Toggle 'nav-toggle' class on the navbar
        $('.navbar').toggleClass('nav-toggle');
    });

    // Cek status login saat halaman dimuat
const token = localStorage.getItem('token');
if (token) {
    fetch('https://projectpalugada.onrender.com', {
        method: 'GET',
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            // Jika token tidak valid (misalnya sudah kedaluwarsa)
            localStorage.removeItem('token');
            throw new Error('Session Expired');
        }
        return response.json();
    })
    .then(user => {
        // Ganti tombol login dengan nama user dan tombol logout
        const loginNavItem = $('#login-nav-item');
        if (loginNavItem.length) {
            loginNavItem.html(`
                <a href="#" style="color: var(--blue);">Hi, ${user.username}</a>
                <a href="#" id="logout-button">Logout</a>
            `);

            // Tambahkan event listener untuk tombol logout
            $('#logout-button').on('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token'); // Hapus token
                alert('Anda telah logout.');
                window.location.reload(); // Muat ulang halaman
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
}

    //Form Submit
    document.getElementById("contactForm").addEventListener("submit", function(event) {
        event.preventDefault();

        //Retrieve form input
        var fullName = document.getElementById("fullName").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;
        var message = document.getElementById("message").value;

        //Construct mailto link with form data
        var mailtoLink = "mailto:dickyke217+testing@gmail.com" +
            "?subject=" + encodeURIComponent("New Form Submission") +
            "&body=" + encodeURIComponent("Full Name: " + fullName + "\nEmail: " + email + "\nPhone Number: " + phone + "\n\nMessage:\n" + message);

        //Re-dir to email
        window.location.href = mailtoLink;
    });

    //Scroll and Load Event Function
    $(window).on('scroll load', function () {
        //Reset Navigation Bar state
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        //Update Header Style based on scroll position
        if ($(window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }

        //ScrollSpy active class navbar
        $('section').each(function () {
            //Offset and retrieve section information
            var offset = 200;
            var top = $(window).scrollTop();
            var id = $(this).attr('id');
            var height = $(this).height();
            var sectionTop = $(this).offset().top - offset;

            //Add active class to the nav-link
            if (top >= sectionTop && top < sectionTop + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find('[href="#' + id + '"]').addClass('active');
            }
        });
    });
});