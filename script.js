let cropper;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];
let currentUser = null;

// GMAIL IDs correct ga undali
const users = {
    "hannu@gmail.com": { role: "Admin", pass: "6301505699" },
    "masoodv6.in@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "reporter@gmail.com": { role: "Reporter", pass: "nv7livenews" }
};

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();
    
    // Debugging: typing mistake unte check cheyadanki
    if (email.includes("gamil.com")) {
        alert("Typo detected! Please use @gmail.com (not @gamil.com)");
        return;
    }

    const foundUser = users[email];

    if (foundUser && foundUser.pass === pass) {
        currentUser = { role: foundUser.role, email: email };
        document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
        document.getElementById('authLinks').classList.add('d-none');
        document.getElementById('userNameDisplay').innerText = foundUser.role;
        
        if (foundUser.role === "Admin" || foundUser.role === "Reporter") {
            document.getElementById('upload-section').classList.remove('d-none');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if(modal) modal.hide();
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    } else {
        alert("Access Denied! Gmail leda Password tappu.");
    }
}

// Image, Crop & Save logic remains same...
document.getElementById('fileInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        if (cropper) cropper.destroy();
        setTimeout(() => { cropper = new Cropper(img, { aspectRatio: NaN, viewMode: 1 }); }, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Select image first!");
    const canvas = cropper.getCroppedCanvas({ width: 1200 });
    window.tempImg = canvas.toDataURL('image/jpeg', 0.9);
    alert("HD Image Ready!");
}

function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if (!window.tempImg || !title) return alert("Title and Crop are required!");

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
    alert("News Published!");
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4 mb-4">
            <div class="news-card">
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
