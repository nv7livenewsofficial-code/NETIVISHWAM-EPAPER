let newsCropper;
let isAuthorized = false;
let mappedItems = 0;

// Admin Authentication
function adminAuth() {
    const user = prompt("Enter Admin Gmail:");
    const pass = prompt("Enter Password:");
    
    // Spelling check for 'gmail.com'
    if ((user === "hannu@gmail.com" || user === "masoodv6.in@gmail.com") && 
        (pass === "6301505699" || pass === "hannu6301505699")) {
        isAuthorized = true;
        document.getElementById('admin-panel').classList.remove('d-none');
        alert("Admin Mode: Area Mapping Enabled.");
    } else {
        alert("Standard User Access: Viewing only.");
    }
}

// Mapping Logic for 10 News Items
function startNewsMapping() {
    if (!isAuthorized) return;
    alert("Click on the image to define 10 news regions.");
    const paperImg = document.getElementById('main-epaper-image');
    
    paperImg.onclick = function(e) {
        if (mappedItems >= 10) return alert("10 areas mapped successfully.");
        
        const rect = paperImg.getBoundingClientRect();
        const xPos = ((e.clientX - rect.left) / rect.width) * 100;
        const yPos = ((e.clientY - rect.top) / rect.height) * 100;
        
        const zone = document.createElement('div');
        zone.className = "news-area-zone";
        zone.style.left = xPos + "%";
        zone.style.top = yPos + "%";
        zone.style.width = "25%"; // Approximate news block width
        zone.style.height = "12%"; // Approximate news block height
        
        document.getElementById('mapping-overlay').appendChild(zone);
        mappedItems++;
    };
}

// User Actions: Crop & HD Save
function toggleCropTool() {
    const img = document.getElementById('main-epaper-image');
    if (newsCropper) {
        newsCropper.destroy();
        newsCropper = null;
    } else {
        newsCropper = new Cropper(img, { viewMode: 1, autoCropArea: 0.2 });
    }
}

function downloadHD() {
    if (!newsCropper) return alert("Select a news clip using CROP first!");
    
    const canvas = newsCropper.getCroppedCanvas({
        width: 1600, // HD Quality
        imageSmoothingQuality: 'high'
    });
    
    const downloadLink = document.createElement('a');
    downloadLink.download = 'Netivishwam-News-HD.jpg';
    downloadLink.href = canvas.toDataURL('image/jpeg', 1.0);
    downloadLink.click();
}

// WhatsApp Share
function shareToWhatsApp() {
    const newsLink = "nv7news.blogspot.com";
    const msg = encodeURIComponent("Check out this news on Netivishwam: " + newsLink);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

let likes = 0;
function handleLike() {
    likes++;
    document.getElementById('count-display').innerText = likes;
}
