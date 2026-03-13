let cropper;
let isAdmin = false;
let mappedCount = 0;

// 1. Admin Login Logic (Fixing the gamil typo)
function adminLogin() {
    const email = prompt("Enter Admin Email:");
    const pass = prompt("Enter Password:");
    
    // Check credentials
    if ((email === "hannu@gmail.com" || email === "masoodv6.in@gmail.com") && 
        (pass === "6301505699" || pass === "hannu6301505699")) {
        isAdmin = true;
        document.getElementById('admin-panel').classList.remove('d-none');
        alert("Admin Mode Active: You can now Map 10 News Areas.");
    } else {
        alert("User Mode: Access Restricted to Crop/Share.");
    }
}

// 2. Admin Mapping Logic (Select 10 news items)
function startMapping() {
    if(!isAdmin) return;
    alert("Click on the image to map 10 news areas.");
    const img = document.getElementById('main-image');
    
    img.onclick = function(e) {
        if (mappedCount >= 10) return alert("10 areas already mapped!");
        
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        createArea(x, y);
        mappedCount++;
    };
}

function createArea(x, y) {
    const zone = document.createElement('div');
    zone.className = 'news-zone';
    zone.style.left = x + '%';
    zone.style.top = y + '%';
    zone.style.width = '25%'; // Fixed width for news block
    zone.style.height = '15%'; // Fixed height for news block
    document.getElementById('map-layer').appendChild(zone);
}

// 3. User Crop Logic
function initCrop() {
    const image = document.getElementById('main-image');
    if (cropper) cropper.destroy();
    cropper = new Cropper(image, { viewMode: 1 });
}

// 4. HD Download Logic
function downloadHD() {
    if (!cropper) return alert("Please select an area using CROP first!");
    
    const canvas = cropper.getCroppedCanvas({
        width: 1600, // HD Width
        imageSmoothingQuality: 'high'
    });
    
    const link = document.createElement('a');
    link.download = 'Netivishwam-News-HD.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

// 5. WhatsApp Sharing
function shareWA() {
    const url = "https://nv7news.blogspot.com";
    const text = encodeURIComponent("Check out this news on Netivishwam: " + url);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Like functionality
let likes = 0;
function react(type) {
    if(type === 'like') likes++;
    document.getElementById('l-count').innerText = likes;
}
