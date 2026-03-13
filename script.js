let newsCropper;
let isAdmin = false;
let mappedCount = 0;

// Admin Login Logic
function adminLogin() {
    const user = prompt("Admin Email:");
    const pass = prompt("Password:");
    
    // Validate Credentials
    if ((user === "hannu@gmail.com" || user === "masoodv6.in@gmail.com") && 
        (pass === "6301505699" || pass === "hannu6301505699")) {
        isAdmin = true;
        document.getElementById('admin-panel').classList.remove('d-none');
        alert("Admin Mode: News Area Mapping Enabled.");
    } else {
        alert("User Access Only.");
    }
}

// Logic to Map 10 News Items
function initMapping() {
    if (!isAdmin) return;
    alert("Click on the page to define 10 news areas.");
    const img = document.getElementById('epaper-image');
    
    img.onclick = (e) => {
        if (mappedCount >= 10) return alert("10 News Items Mapped.");
        
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const box = document.createElement('div');
        box.className = "mapped-box";
        box.style.left = x + "%";
        box.style.top = y + "%";
        box.style.width = "25%"; // Standard news width
        box.style.height = "12%"; // Standard news height
        
        document.getElementById('mapping-layer').appendChild(box);
        mappedCount++;
    };
}

// User Action: HD Cropping
function startCrop() {
    const image = document.getElementById('epaper-image');
    if (newsCropper) {
        newsCropper.destroy();
        newsCropper = null;
    } else {
        newsCropper = new Cropper(image, { viewMode: 1, autoCropArea: 0.2 });
    }
}

function downloadHD() {
    if (!newsCropper) return alert("Select a news area first!");
    
    // Export in HD Resolution
    const canvas = newsCropper.getCroppedCanvas({
        width: 1600,
        imageSmoothingQuality: 'high'
    });
    
    const link = document.createElement('a');
    link.download = 'Netivishwam-News-HD.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

// WhatsApp Share
function shareWhatsApp() {
    const domain = "nv7news.blogspot.com";
    const msg = encodeURIComponent("Read Netivishwam News: " + domain);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

let likes = 0;
function likePost() {
    likes++;
    document.getElementById('like-count').innerText = likes;
}
