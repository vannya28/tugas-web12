document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const newPostForm = document.getElementById('new-post-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const defaultPosts = [
        {
            title: "Tips Produktivitas saat Bekerja dari Rumah 🏡",
            content: "Untuk menjaga produktivitas, buat jadwal harian yang ketat, sisihkan waktu istirahat yang cukup, dan pastikan Anda memiliki area kerja yang terpisah dari tempat santai. Konsisten adalah kuncinya!",
            author: "Pegawai Remote",
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            comments: [
                { author: "Budi", text: "Sangat membantu, terima kasih atas tipsnya!" }
            ]
        },
        {
            title: "Review Buku 'Atomic Habits' oleh James Clear",
            content: "Buku ini sangat direkomendasikan untuk siapa saja yang ingin membuat perubahan kecil namun berdampak besar. Fokus pada sistem, bukan pada tujuan. Kebiasaan kecil yang konsisten akan membawa hasil besar.",
            author: "Kutu Buku",
            date: new Date(Date.now() - 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            comments: [
                { author: "Susi", text: "Saya setuju! Buku yang mengubah perspektif." },
                { author: "Joko", text: "Sudah masuk daftar bacaan saya!" }
            ]
        },
        {
            title: "Mengapa Belajar Coding Itu Penting?",
            content: "Coding tidak hanya berguna untuk menjadi seorang *developer*. Belajar coding melatih logika berpikir, kemampuan memecahkan masalah, dan kreativitas. Ini adalah *skill* fundamental di era digital.",
            author: "Pendidik",
            date: new Date(Date.now() - 2 * 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            comments: []
        }
    ];

    let posts = JSON.parse(localStorage.getItem('blogPosts'));
    if (!posts || posts.length === 0) {
        posts = defaultPosts;
        localStorage.setItem('blogPosts', JSON.stringify(posts)); 
    }

    const renderPosts = () => {
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

        attachCommentListeners();
    };

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
                author: 'Pengguna Saat Ini', 
                date: dateString,
                comments: []
            };

            posts.unshift(newPost); 
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            
            this.reset();
            renderPosts();
            alert('Postingan berhasil diunggah!');
        });

        renderPosts(); 
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            alert(`Selamat datang, ${username}! Anda berhasil Login.`);
            window.location.href = 'index.html'; 
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const username = document.getElementById('reg-username').value;
            
            if (password !== confirmPassword) {
                alert('Password dan Konfirmasi Password tidak cocok!');
                return;
            }

            alert(`Pendaftaran akun untuk ${username} berhasil! Silakan Login.`);
            window.location.href = 'login.html'; 
        });
    }

    function attachCommentListeners() {
        document.querySelectorAll('.comment-form').forEach(form => {
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
            author: 'Pengunjung', 
            text: commentText
        };

        posts[postIndex].comments.push(newComment);
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        textarea.value = '';

        renderPosts(); 
    }
});
