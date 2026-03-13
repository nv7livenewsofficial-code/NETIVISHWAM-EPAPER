let cropper;
let currentUser = null;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];

// 1. UPDATED AUTHORIZED USER LIST
const users = {
    "hannu@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "masoodv6.in@gmail.com": { role: "Admin", pass: "hannu6301505699" }, // Mee ID add cheshanu
    "reporter@gmail.com": { role: "Reporter", pass: "nv7livenews" }
};

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();
    const foundUser = users[email];

    if (foundUser && foundUser.pass === pass) {
        processLogin(foundUser.role, email);
    } else {
        alert("Access Denied! Gmail leda Password tappu.");
    }
}

function processLogin(role, email) {
    currentUser = { role, email };
    document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
    document.getElementById('authLinks').classList.add('d-none');
    document.getElementById('userNameDisplay').innerText = `${role}`;

    if (role === "Admin" || role === "Reporter") {
        document.getElementById('upload-section').classList.remove('d-none');
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if(modal) modal.hide();
}

// 2. IMAGE HANDLING
document.getElementById('fileInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        if (cropper) cropper.destroy();
        setTimeout(() => {
            cropper = new Cropper(img, { aspectRatio: NaN, viewMode: 1 });
        }, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Select image!");
    const canvas = cropper.getCroppedCanvas({ width: 1200 });
    window.tempImg = canvas.toDataURL('image/jpeg', 0.9);
    alert("HD Image Ready!");
}

function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if (!window.tempImg || !title) return alert("Title & Crop are required!");

    const article = {
        id: Date.now(),
        title: title,
        cat: document.getElementById('newsCat').value,
        img: window.tempImg,
        author: currentUser.role,
        date: new Date().toLocaleDateString()
    };

    newsList.unshift(article);
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    renderNews();
    alert("Published!");
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4">
            <div class="news-card shadow-sm">
                <div class="card-title-overlay">${n.title}</div>
                <img src="${n.img}">
                <div class="p-3">
                    <span class="badge bg-primary mb-2">${n.cat}</span>
                    <p class="small text-muted mb-0">Published: ${n.date}</p>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title)}" target="_blank" class="btn btn-success btn-sm w-100 mt-2">WhatsApp Share</a>
                </div>
            </div>
        </div>
    `).join('');
}

function logout() { location.reload(); }
window.onload = renderNews;
