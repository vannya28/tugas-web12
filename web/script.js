document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const newPostForm = document.getElementById('new-post-form');
    const loginForm = document.getElementById('login-form');

    // --- Data Postingan Sederhana (Menggunakan Local Storage) ---
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    // Fungsi untuk menampilkan postingan
    const renderPosts = () => {
        // Hapus postingan contoh yang ada di HTML, sisakan judul
        postsContainer.innerHTML = '<h2>Postingan Terbaru</h2>'; 

        if (posts.length === 0) {
            postsContainer.innerHTML += '<p>Belum ada postingan. Ayo buat yang pertama!</p>';
            return;
        }

        posts.forEach((post, index) => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p class="post-meta">Diposting oleh <strong>${post.author}</strong> pada ${post.date}</p>
                <p>${post.content}</p>

                <div class="comments-section">
                    <h4>Komentar (${post.comments.length})</h4>
                    <div class="comments-list" id="comments-for-post-${index}">
                        ${post.comments.map(comment => `
                            <div class="comment">
                                <p><strong>${comment.author}:</strong> ${comment.text}</p>
                            </div>
                        `).join('')}
                    </div>
                    <form class="comment-form" data-post-index="${index}">
                        <textarea placeholder="Tulis komentar Anda..." required></textarea>
                        <button type="submit">Kirim Komentar</button>
                    </form>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        // Setelah postingan di-render, pasang event listener untuk formulir komentar
        attachCommentListeners();
    };

    // --- Fitur Membuat Postingan Baru ---
    if (newPostForm) {
        newPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            const newPost = {
                title: title,
                content: content,
                author: 'Pengguna Saat Ini', // Ganti dengan nama pengguna jika sudah login
                date: dateString,
                comments: []
            };

            posts.unshift(newPost); // Tambahkan di awal array
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            
            // Bersihkan formulir
            this.reset();
            renderPosts();
            alert('Postingan berhasil diunggah!');
        });

        // Tampilkan postingan saat halaman dimuat
        renderPosts(); 
    }

    // --- Fitur Login Sederhana (Hanya Alert) ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            // Dalam proyek nyata, Anda akan mengirim ini ke server
            alert(`Selamat datang, ${username}! Anda berhasil Login!`);
            // Redireksi ke halaman utama setelah login
            window.location.href = 'index.html'; 
        });
    }

    // --- Fitur Komentar Interaktif ---
    function attachCommentListeners() {
        document.querySelectorAll('.comment-form').forEach(form => {
            // Hapus listener lama untuk menghindari duplikasi
            form.removeEventListener('submit', handleCommentSubmit); 
            form.addEventListener('submit', handleCommentSubmit);
        });
    }

    function handleCommentSubmit(e) {
        e.preventDefault();
        const postIndex = e.target.getAttribute('data-post-index');
        const textarea = e.target.querySelector('textarea');
        const commentText = textarea.value;

        if (commentText.trim() === "") return;

        const newComment = {
            author: 'Pengunjung', // Ganti dengan nama pengguna sebenarnya
            text: commentText
        };

        // Tambahkan komentar ke data
        posts[postIndex].comments.push(newComment);
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        // Bersihkan textarea
        textarea.value = '';

        // Render ulang postingan (atau hanya bagian komentar, untuk efisiensi)
        renderPosts(); 
    }
});