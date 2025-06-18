const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// --- FORM REGISRTRASI ---

// 1. Pilih elemen form registrasi
const registerForm = document.getElementById('registerForm');

// 2. Menambahkan event listener saat form disubmit
registerForm.addEventListener('submit', async (event) => {
    // Agar form tidak melakukan reload halaman
    event.preventDefault();

    // 3. Ambil nilai dari setiap input
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Untuk validasi
    if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
    }

    // 4. Menyiapkan data untuk dikirim ke server
    const formData = {
        username: username,
        email: email,
        password: password
    };

    // 5. Mengirim data ke API
    try {
        const response = await fetch('https://projectpalugada.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Untuk Mengubah respons server menjadi format JSON
        const result = await response.json();

        // 6. Menampilkan pesan dari server
        if (response.ok) { // Kalo kode 200-299 = sukses
            alert(result.message);
            loginBtn.click();
        } else { // Kalo kode 400-599 = gagal
            alert('Error: ' + result.message);
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
    }
});

// --- LOGIKA LOGIN BARU ---

// 1. Pilih elemen form login
const loginForm = document.getElementById('loginForm');

// 2. Tambahkan event listener saat form di-submit
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 3. Ambil nilai dari input email dan password
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = {
        email: email,
        password: password
    };

    // 4. Kirim data ke API login
    try {
        const response = await fetch('https://projectpalugada.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login berhasil!');
            // 5. Simpan token di localStorage browser
            localStorage.setItem('token', result.token);
            // 6. Arahkan pengguna ke halaman utama
            window.location.href = '../index.html'; // Sesuaikan path jika perlu
        } else {
            alert('Error: ' + result.message);
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Tidak dapat terhubung ke server.');
    }
});