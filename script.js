/* NETIVISHWAM EPAPER - script.js
   Features: Gmail Auth, HD Cropping, Role-based Dashboard
*/

let cropper;
let currentUser = null;
let newsList = JSON.parse(localStorage.getItem('neti_hd_news')) || [];

// 1. AUTHORIZED GMAIL LIST (Mee Gmail ikkada add ayyi undi)
const authorizedUsers = {
    "hannu@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "masoodv6.in@gmail.com": { role: "Admin", pass: "hannu6301505699" },
    "reporter@gmail.com": { role: "Reporter", pass: "nv7livenews" }
};

// --- LOGIN LOGIC ---
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();

    const userData = authorizedUsers[email];

    if (userData && userData.pass === pass) {
        processLogin(userData.role, email);
    } else {
        alert("Access Denied! \nGmail ID: " + email + " recognized ledu leda Password tappu.");
    }
}

function processLogin(role, email) {
    currentUser = { role: role, email: email };
    
    // UI Updates
    document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
    document.getElementById('authLinks').classList.add('d-none');
    document.getElementById('userNameDisplay').innerText = role;

    // Show Dashboard only for Admin/Reporter
    if (role === "Admin" || role === "Reporter") {
        document.getElementById('upload-section').classList.remove('d-none');
        document.getElementById('panelTitle').innerText = role + " Dashboard";
    }

    // Modal close logic
    const modalElement = document.getElementById('loginModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
    
    // Clean up modal backdrop if it stays
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.style.overflow = 'auto';
}

// --- IMAGE CROPPING (HD QUALITY) ---
document.getElementById('fileInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.getElementById('cropImage');
        img.src = event.target.result;
        
        if (cropper) {
            cropper.destroy();
        }
        
        setTimeout(() => {
            cropper = new Cropper(img, {
                aspectRatio: NaN, // Free crop
                viewMode: 1,
                autoCropArea: 1
            });
        }, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function startCrop() {
    if (!cropper) return alert("Munde oka image select cheyyandi!");
    
    // HD Quality maintain cheyadaniki 1200px width set chesam
    const canvas = cropper.getCroppedCanvas({ width: 1200 }); 
    window.tempImg = canvas.toDataURL('image/jpeg', 0.9);
    
    // Preview update
    document.getElementById('cropImage').src = window.tempImg;
    alert("HD Image Ready! Ippudu details fill chesi Publish kottandi.");
}

// --- SAVE & RENDER NEWS ---
function saveNews() {
    const title = document.getElementById('newsTitle').value.trim();
    const cat = document.getElementById('newsCat').value;
    
    if (!window.tempImg || !title) {
        return alert("Title mariyu Image Cropping rendu thappanisari!");
    }

    const article = {
        id: Date.now(),
        title: title,
        cat: cat,
        img: window.tempImg,
        author: currentUser.role,
        date: new Date().toLocaleDateString('en-IN')
    };

    newsList.unshift(article);
    localStorage.setItem('neti_hd_news', JSON.stringify(newsList));
    
    // Reset Form
    document.getElementById('newsTitle').value = "";
    window.tempImg = null;
    
    renderNews();
    alert("News Published Successfully!");
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (newsList.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted"><p>No news available yet.</p></div>';
        return;
    }

    grid.innerHTML = newsList.map(n => `
        <div class="col-md-4">
            <div class="news-card shadow-sm">
                <div class="card-title-overlay">${n.title}</div>
                <img src="${n.img}" alt="news-image">
                <div class="p-3">
                    <span class="badge bg-primary mb-2">${n.cat}</span>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <small class="text-muted">By ${n.author} | ${n.date}</small>
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(n.title + " - View on Netivishwam")}" 
                           target="_blank" class="btn btn-success btn-sm px-3">
                           WhatsApp Share
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// --- LOGOUT ---
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUserSession'); // Optional session clear
    location.reload();
}

// Initial Render
window.onload = renderNews;
