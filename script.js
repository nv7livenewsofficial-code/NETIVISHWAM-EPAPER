let cropper;
let nv_data = JSON.parse(localStorage.getItem('nv_editions')) || [];
let currentUser = null;

const users = {
    "hannu@gmail.com": "6301505699",
    "masoodv6.in@gmail.com": "hannu6301505699"
};

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
        alert("Access Denied! Gmail ID spelling check cheyyandi (gmail.com).");
    }
}

function showUploadPanel() { document.getElementById('upload-panel').classList.toggle('d-none'); }

document.getElementById('fileInput').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('rawPreview').src = event.target.result;
        document.getElementById('rawPreview').style.display = 'block';
        document.getElementById('imageToCrop').src = event.target.result;
        document.getElementById('cropTrigger').style.display = 'block';
    };
    reader.readAsDataURL(e.target.files[0]);
};

// SHARING & TOOLS
document.getElementById('cropModal').addEventListener('shown.bs.modal', function () {
    const img = document.getElementById('imageToCrop');
    if (cropper) cropper.destroy();
    cropper = new Cropper(img, { aspectRatio: 3/4, viewMode: 1 });
});

function applyCrop() {
    window.croppedImg = cropper.getCroppedCanvas({ width: 800 }).toDataURL('image/jpeg');
    document.getElementById('rawPreview').src = window.croppedImg;
    document.getElementById('publishBtn').disabled = false;
    bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
}

function saveEdition() {
    const name = document.getElementById('editionName').value;
    nv_data.unshift({ id: Date.now(), name: name, img: window.croppedImg });
    localStorage.setItem('nv_editions', JSON.stringify(nv_data));
    renderEditions();
    alert("Edition Published!");
}

function deleteEdition(id) {
    if(confirm("Delete this?")) {
        nv_data = nv_data.filter(e => e.id !== id);
        localStorage.setItem('nv_editions', JSON.stringify(nv_data));
        renderEditions();
    }
}

function renderEditions() {
    const grid = document.getElementById('edition-grid');
    grid.innerHTML = nv_data.map(e => `
        <div class="col-6 col-md-3">
            <div class="edition-card shadow-sm">
                ${currentUser ? `<button class="btn-delete" onclick="deleteEdition(${e.id})">✖</button>` : ''}
                <img src="${e.img}" onclick="window.open('${e.img}', '_blank')">
                <div class="title-bar">${e.name}</div>
                <button class="btn btn-success btn-sm w-100 mt-2" onclick="share('${e.name}')">WhatsApp Share</button>
            </div>
        </div>
    `).join('');
}

function share(name) {
    const text = encodeURIComponent(`Check out ${name} Edition on Netivishwam: https://nv7news.blogspot.com`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

window.onload = renderEditions;
