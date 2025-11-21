document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const newPostForm = document.getElementById('new-post-form');
    const loginForm = document.getElementById('login-form');
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

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
            alert(`Selamat datang, ${username}! Anda berhasil Login!`);
            window.location.href = 'index.html'; 
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
