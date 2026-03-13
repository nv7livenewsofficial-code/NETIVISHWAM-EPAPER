let cropper;
let currentUser = null;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];

// 1. Auth Logic
function handleLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if(u === 'hannu' && p === 'hannu6301505699') login('Admin');
    else if(u === 'hannu' && p === 'nv7livenews') login('Reporter');
    else alert("Wrong credentials!");
}

function login(role) {
    currentUser = role;
    document.getElementById('userLinks').classList.remove('d-none');
    document.getElementById('authLinks').classList.add('d-none');
    document.getElementById('userName').innerText = role;
    document.getElementById('upload-section').classList.remove('d-none');
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
}

// 2. Image Cropping Logic
document.getElementById('fileInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        if(cropper) cropper.destroy();
        cropper = new Cropper(img, { aspectRatio: NaN, viewMode: 1 });
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if(!cropper) return alert("Select image first");
    const canvas = cropper.getCroppedCanvas({ width: 1200 }); // HD Quality
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    window.tempImg = croppedUrl;
    alert("Image Cropped & Ready!");
}

// 3. Save News
function saveNews() {
    const title = document.getElementById('newsTitle').value;
    if(!window.tempImg || !title) return alert("Fill all details");

    const article = {
        id: Date.now(),
        title: title,
        cat: document.getElementById('newsCat').value,
        img: window.tempImg,
        author: currentUser
    };

    newsList.unshift(article);
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    renderAll();
    alert("News Published Successfully!");
}

// 4. Render & Share
function renderAll() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4">
            <div class="news-card shadow-sm">
                <img src="${n.img}">
                <div class="p-3">
                    <span class="badge bg-primary mb-2">${n.cat}</span>
                    <h6 class="fw-bold">${n.title}</h6>
                    <div class="share-box">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title)}" class="share-btn wa">WhatsApp</a>
                        <button class="btn btn-light btn-sm" onclick="copyLink(${n.id})">Copy Link</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function copyLink(id) {
    navigator.clipboard.writeText(window.location.href + "?id=" + id);
    alert("Link Copied!");
}

function logout() {
    location.reload();
}

function openLogin() {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

window.onload = renderAll;