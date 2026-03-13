let cropper;
let isAdmin = false;
let mappedCount = 0;

// Admin Auth logic
function handleAuth() {
    const email = prompt("Admin Email:");
    const pass = prompt("Password:");
    
    // Check credentials from user data
    if ((email === "hannu@gmail.com" || email === "masoodv6.in@gmail.com") && 
        (pass === "6301505699" || pass === "hannu6301505699")) {
        isAdmin = true;
        document.getElementById('admin-panel').classList.remove('d-none');
        alert("Admin Mode: Start mapping news areas.");
    } else {
        alert("User Mode Active.");
    }
}

// Logic to map 10 news areas on a single page
function mapAreas() {
    if (!isAdmin) return;
    alert("Click on the image to define 10 news areas.");
    const img = document.getElementById('paper-img');
    
    img.onclick = function(e) {
        if (mappedCount >= 10) return alert("10 areas already mapped.");
        
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const zone = document.createElement('div');
        zone.className = "news-zone";
        zone.style.left = x + "%";
        zone.style.top = y + "%";
        zone.style.width = "25%"; // Default news block width
        zone.style.height = "12%"; // Default news block height
        
        document.getElementById('mapping-layer').appendChild(zone);
        mappedCount++;
    };
}

// HD Crop Logic
function initCrop() {
    const img = document.getElementById('paper-img');
    if (cropper) cropper.destroy();
    cropper = new Cropper(img, { viewMode: 1, autoCropArea: 0.3 });
}

function saveHD() {
    if (!cropper) return alert("Please use the CROP tool first!");
    
    const canvas = cropper.getCroppedCanvas({
        width: 1600, // HD Resolution
        imageSmoothingQuality: 'high'
    });
    
    const link = document.createElement('a');
    link.download = 'Netivishwam-News-HD.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

function shareWA() {
    const url = "nv7news.blogspot.com";
    const msg = encodeURIComponent("Check out today's news: " + url);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

let reactions = 0;
function updateReaction() {
    reactions++;
    document.getElementById('count').innerText = reactions;
}
