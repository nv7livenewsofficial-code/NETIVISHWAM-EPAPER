let cropper;
let nv_editions = JSON.parse(localStorage.getItem('nv7_editions')) || [];
let currentUser = null;

// Credentials from summary
const users = {
    "hannu@gmail.com": "6301505699",
    "masoodv6.in@gmail.com": "hannu6301505699"
};

// specialized Date Display
document.getElementById('currentDate').innerText = new Date().toDateString();

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();

    if (users[email] === pass) {
        currentUser = email;
        document.getElementById('userLinks').classList.replace('d-none', 'd-flex');
        document.getElementById('authLinks').classList.add('d-none');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        renderEditions();
    } else {
        alert("Access Denied! Check Gmail spelling (gmail.com) and Password.");
    }
}

function showUploadPanel() {
    document.getElementById('upload-panel').classList.remove('d-none');
}

// 1. Initial Image Selection (No Cropper yet)
document.getElementById('fileInput').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        // Show basic preview in panel
        const rawPreview = document.getElementById('rawImagePreview');
        rawPreview.src = event.target.result;
        rawPreview.style.display = 'block';
        document.getElementById('noImageText').style.display = 'none';

        // Set image for the specialized modal
        document.getElementById('imageToCrop').src = event.target.result;
        
        // Show specialized Crop specialized button
        document.getElementById('openCropModal').style.display = 'block';
    };
    reader.readAsDataURL(e.target.files[0]);
};

// 2. Initialize Cropper ONLY when specialized modal is shown (Dynamic Tools)
document.getElementById('cropModal').addEventListener('shown.bs.modal', function () {
    const img = document.getElementById('imageToCrop');
    if (cropper) cropper.destroy();
    cropper = new Cropper(img, {
        aspectRatio: 3 / 4,
        viewMode: 1,
        autoCropArea: 1,
    });
});

// 3. specialized Crop Logic (Triggered on click)
function finalizeCrop() {
    if (!cropper) return;
    window.croppedImageData = cropper.getCroppedCanvas({ width: 1000 }).toDataURL('image/jpeg', 0.9);
    
    // Update raw preview with the specialized cropped image
    document.getElementById('rawImagePreview').src = window.croppedImageData;
    
    // Close modal and enable specialized Publish button
    bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
    document.getElementById('publishBtn').disabled = false;
    alert("HD Crop Applied Successfully!");
}

function publishEdition() {
    const name = document.getElementById('editionName').value;
    if (!window.croppedImageData || !name) return alert("Required fields missing!");
    
    nv_editions.unshift({ id: Date.now(), name: name, img: window.croppedImageData });
    localStorage.setItem('nv7_editions', JSON.stringify(nv_editions));
    renderEditions();
    document.getElementById('upload-panel').classList.add('d-none');
}

function deleteEdition(id) {
    if(confirm("Delete this edition?")) {
        nv_editions = nv_editions.filter(e => e.id !== id);
        localStorage.setItem('nv7_editions', JSON.stringify(nv_editions));
        renderEditions();
    }
}

function renderEditions() {
    const grid = document.getElementById('edition-grid');
    grid.innerHTML = nv_editions.map(e => `
        <div class="col-6 col-md-3">
            <div class="edition-card shadow-sm">
                ${currentUser ? `<button class="btn-delete" onclick="deleteEdition(${e.id})">✖</button>` : ''}
                <img src="${e.img}" onclick="window.open('${e.img}', '_blank')" title="View Full Page">
                <div class="title-tag">${e.name}</div>
                <button class="btn btn-whatsapp btn-sm w-100 mt-2" onclick="shareToWhatsApp('${e.name}')">WhatsApp Share</button>
            </div>
        </div>
    `).join('');
}

function shareToWhatsApp(name) {
    const url = "https://nv7news.blogspot.com"; // specialized domain from ledger summary
    const text = encodeURIComponent(`Check out the latest ${name} edition of Netivishwam E-paper: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function logout() { location.reload(); }
window.onload = renderNews;
