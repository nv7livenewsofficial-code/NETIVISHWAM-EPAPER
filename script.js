let cropper;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];
let currentUser = null;

const categories = ["Politics", "Sports", "Crime", "Local", "Health", "Cinema"];

const users = {
    "hannu@gmail.com": { role: "Admin", pass: "6301505699" },
    "masoodv6.in@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "reporter@gmail.com": { role: "Reporter", pass: "nv7livenews" }
};

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();
    const user = users[email];

    if (user && user.pass === pass) {
        currentUser = user;
        document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
        document.getElementById('authLinks').classList.add('d-none');
        document.getElementById('userNameDisplay').innerText = user.role;
        
        if (user.role === "Admin" || user.role === "Reporter") {
            document.getElementById('upload-section').classList.remove('d-none');
            setupCategories();
        }
        renderNews(); // Admin login ayyaka delete buttons kanipinchadaniki
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    } else {
        alert("Invalid Credentials!");
    }
}

function setupCategories() {
    const el = document.getElementById('newsCat');
    if(el) el.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

document.getElementById('fileInput').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        if (cropper) cropper.destroy();
        setTimeout(() => { cropper = new Cropper(img, { aspectRatio: NaN, viewMode: 1 }); }, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Select image!");
    window.tempImg = cropper.getCroppedCanvas({ width: 1200 }).toDataURL('image/jpeg', 0.9);
    alert("HD Ready!");
}

function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if (!window.tempImg || !title) return alert("Required fields missing!");
    
    newsList.unshift({
        id: Date.now(),
        title,
        cat: document.getElementById('newsCat').value,
        img: window.tempImg,
        author: currentUser ? currentUser.role : "System",
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    renderNews();
    alert("Published!");
}

// DELETE OPTION LOGIC
function deleteNews(id) {
    if(confirm("Are you sure you want to delete this news?")) {
        newsList = newsList.filter(n => n.id !== id);
        localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
        renderNews();
    }
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4 mb-4">
            <div class="news-card">
                ${currentUser && (currentUser.role === 'Admin') ? `<button class="btn btn-danger btn-delete" onclick="deleteNews(${n.id})">✖</button>` : ''}
                <div class="card-title-overlay">${n.title}</div>
                <img src="${n.img}">
                <div class="p-3">
                    <span class="badge bg-primary mb-2">${n.cat}</span>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title)}" target="_blank" class="btn btn-success btn-sm w-100">WhatsApp Share</a>
                </div>
            </div>
        </div>
    `).join('');
}

function logout() { location.reload(); }
window.onload = renderNews;
