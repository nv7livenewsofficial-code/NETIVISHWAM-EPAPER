let cropper;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];
let currentUser = null;

const categories = ["Andhra Pradesh", "Telangana", "Hyderabad", "District Editions", "National"];

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
        renderNews();
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    } else {
        alert("Access Denied! Gmail leda Password tappu.");
    }
}

function setupCategories() {
    const el = document.getElementById('newsCat');
    el.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

document.getElementById('fileInput').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        if (cropper) cropper.destroy();
        setTimeout(() => { cropper = new Cropper(img, { aspectRatio: 3/4, viewMode: 1 }); }, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Select image!");
    window.tempImg = cropper.getCroppedCanvas({ width: 1200 }).toDataURL('image/jpeg', 0.9);
    alert("HD Thumbnail Ready!");
}

function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if (!window.tempImg || !title) return alert("All fields are required!");
    
    newsList.unshift({
        id: Date.now(),
        title,
        cat: document.getElementById('newsCat').value,
        img: window.tempImg
    });
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    renderNews();
    alert("Edition Published!");
}

function deleteNews(id) {
    if(confirm("Delete this edition?")) {
        newsList = newsList.filter(n => n.id !== id);
        localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
        renderNews();
    }
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.innerHTML = newsList.map(n => `
        <div class="col-6 col-md-3">
            <div class="news-card">
                ${currentUser && currentUser.role === 'Admin' ? `<button class="btn-delete" onclick="deleteNews(${n.id})">✖</button>` : ''}
                <img src="${n.img}" alt="${n.title}">
                <div class="card-title-bar">${n.title}</div>
            </div>
        </div>
    `).join('');
}

function logout() { location.reload(); }
window.onload = renderNews;
