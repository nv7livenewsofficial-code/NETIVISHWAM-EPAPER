let cropper;
let currentUser = null;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];

// 1. AUTHORIZED USER LIST
const users = {
    "hannu@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "reporter@gmail.com": { role: "Reporter", pass: "nv7livenews" },
    "user@gmail.com": { role: "User", pass: "user123" }
};

// 2. AUTH LOGIC
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
    
    // UI Setup
    document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
    document.getElementById('authLinks').classList.add('d-none');
    document.getElementById('userNameDisplay').innerText = `${role} (${email})`;

    // Panel Visibility Logic
    if (role === "Admin" || role === "Reporter") {
        document.getElementById('upload-section').classList.remove('d-none');
        document.getElementById('panelTitle').innerText = role + " Dashboard";
    } else {
        document.getElementById('upload-section').classList.add('d-none');
        alert("Welcome User! Meeru news chadavachu.");
    }

    // Modal Hide
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if(modal) modal.hide();
}

// 3. IMAGE CROPPING (HD)
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
    if (!cropper) return alert("Select an image first!");
    const canvas = cropper.getCroppedCanvas({ width: 1200 }); // High Quality
    window.tempImg = canvas.toDataURL('image/jpeg', 0.9);
    alert("Image Cropped! Fill details and Publish.");
}

// 4. PUBLISH NEWS
function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if (!window.tempImg || !title) return alert("Title and Cropped Image are required!");

    const article = {
        id: Date.now(),
        title: title,
        cat: document.getElementById('newsCat').value,
        img: window.tempImg,
        author: currentUser.role,
        email: currentUser.email,
        date: new Date().toLocaleDateString()
    };

    newsList.unshift(article);
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    
    document.getElementById('newsTitle').value = "";
    window.tempImg = null;
    
    renderNews();
    alert("Published Successfully!");
}

// 5. RENDER NEWS
function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (newsList.length === 0) {
        grid.innerHTML = '<p class="text-center text-muted">No news available.</p>';
        return;
    }

    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4">
            <div class="news-card">
                <img src="${n.img}">
                <div class="p-3">
                    <span class="badge bg-primary badge-cat mb-2">${n.cat}</span>
                    <h6 class="fw-bold">${n.title}</h6>
                    <p class="small text-muted mb-3">By ${n.author} (${n.email})</p>
                    <div class="d-flex gap-2">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title)}" target="_blank" class="btn btn-success btn-sm flex-grow-1">Share</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function logout() {
    location.reload();
}

window.onload = renderNews;
