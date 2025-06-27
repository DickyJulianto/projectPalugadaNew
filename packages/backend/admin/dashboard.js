document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const tableBody = document.getElementById('users-table-body');
    const logoutButton = document.getElementById('logout-button');

    // PENGECEKAN AKSES
    if (!token || userRole !== 'admin') {
        // Jika tidak ada token atau role bukan admin, tendang ke halaman login
        alert('Access Denied. Please login as an admin.');
        window.location.href = '../login_page/login.html';
        return;
    }

    // FUNGSI LOGOUT
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            alert('You have been logged out.');
            window.location.href = '../login_page/login.html';
        });
    }

    // FUNGSI MENGAMBIL DATA PENGGUNA DARI API
    async function fetchUsers() {
        try {
            const response = await fetch('https://projectpalugada.onrender.com/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Kirim token untuk otorisasi
                }
            });

            if (!response.ok) {
                // Jika status bukan 2xx (misal 401, 403, 500)
                throw new Error(`Error: ${response.statusText}`);
            }

            const users = await response.json();
            displayUsers(users);

        } catch (error) {
            console.error('Failed to fetch users:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="loading-text" style="color: red;">Failed to load user data.</td></tr>`;
        }
    }

    // FUNGSI MENAMPILKAN DATA PENGGUNA KE TABEL
    function displayUsers(users) {
        // Kosongkan isi tabel terlebih dahulu
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="loading-text">No users found.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Format tanggal agar lebih mudah dibaca
            const joinDate = new Date(user.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.ssoProvider || 'Manual'}</td>
                <td>${joinDate}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Panggil fungsi untuk mengambil data saat halaman dimuat
    fetchUsers();
});