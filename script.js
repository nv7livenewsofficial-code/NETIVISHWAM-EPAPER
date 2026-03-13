let cropper;
let currentUser = null;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];

// 1. Auth Logic - Fixed Modal Handling
function handleLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if (u === 'hannu' && p === 'hannu6301505699') {
        login('Admin');
    } else if (u === 'hannu' && p === 'nv7livenews') {
        login('Reporter');
    } else {
        alert("Invalid Username or Password!");
    }
}

function login(role) {
    currentUser = role;
    
    // UI elements update
    document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
    document.getElementById('authLinks').classList.add('d-none');
    document.getElementById('userName').innerText = "Hello, " + role;
    document.getElementById('upload-section').classList.remove('d-none');

    // Modal ni close chese correct paddhati
    const modalElement = document.getElementById('loginModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
    
    // Check if backdrop remains
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.style.overflow = 'auto';
}

// 2. Image Cropping Logic - Fixed preview and destruction
document.getElementById('fileInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        
        if (cropper) {
            cropper.destroy();
        }
        
        // Timeout ensures image is loaded before cropper starts
        setTimeout(() => {
            cropper = new Cropper(img, {
                aspectRatio: NaN,
                viewMode: 1,
                autoCropArea: 1
            });
        }, 100);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Please select an image first!");
    
    const canvas = cropper.getCroppedCanvas({ width: 1200 }); // HD Quality
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    window.tempImg = croppedUrl;
    
    // Preview image update after crop (Optional but helpful)
    document.getElementById('cropImage').src = croppedUrl;
    alert("Image Cropped Successfully! Now fill details and Publish.");
}

// 3. Save News - Fixed data persistence
function saveNews() {
    const title = document.getElementById('newsTitle').value;
    const cat = document.getElementById('newsCat').value;
    
    if (!window.tempImg) return alert("Please crop the image first!");
    if (!title) return alert("Please enter a Title!");

    const article = {
        id: Date.now(),
        title: title,
        cat: cat,
        img: window.tempImg,
        author: currentUser,
        date: new Date().toLocaleDateString()
    };

    newsList.unshift(article);
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    
    // Reset inputs
    document.getElementById('newsTitle').value = "";
    window.tempImg = null;
    
    renderAll();
    alert("Success! News Published in HD.");
}

// 4. Render & Share
function renderAll() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (newsList.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted"><p>No news articles found.</p></div>';
        return;
    }

    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4">
            <div class="card news-card shadow-sm h-100">
                <img src="${n.img}" class="card-img-top">
                <div class="card-body p-3">
                    <span class="badge bg-primary mb-2">${n.cat}</span>
                    <h6 class="fw-bold mb-1">${n.title}</h6>
                    <small class="text-muted d-block mb-3">By ${n.author} | ${n.date || ''}</small>
                    <div class="d-flex gap-2">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title + " - Read more at Netivishwam")}" target="_blank" class="btn btn-success btn-sm flex-grow-1">WhatsApp</a>
                        <button class="btn btn-light btn-sm border" onclick="copyLink(${n.id})">Copy Link</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function copyLink(id) {
    const url = window.location.origin + window.location.pathname + "?id=" + id;
    navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
    });
}

function logout() {
    currentUser = null;
    sessionStorage.clear();
    location.reload();
}

// Modal management for the Login button
function openLogin() {
    const myModal = new bootstrap.Modal(document.getElementById('loginModal'));
    myModal.show();
}

window.onload = renderAll;
