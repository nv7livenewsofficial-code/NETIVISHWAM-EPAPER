let cropper;
let isAdmin = false;
let count = 0;

// Admin Login
function loginCheck() {
    const email = prompt("Gmail ID:");
    const pass = prompt("Password:");
    
    // Spelling fixed to gmail.com
    if ((email === "hannu@gmail.com" || email === "masoodv6.in@gmail.com") && 
        (pass === "6301505699" || pass === "hannu6301505699")) {
        isAdmin = true;
        document.getElementById('admin-bar').classList.remove('d-none');
        alert("Admin Mode On: Map 10 items now.");
    }
}

// 10 News Area Mapping (Admin)
function startMapping() {
    if(!isAdmin) return;
    alert("Click on 10 news items to map them.");
    const img = document.getElementById('epaper-img');
    img.onclick = (e) => {
        if(count >= 10) return alert("Mapping Complete (10 Items).");
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const zone = document.createElement('div');
        zone.className = "news-zone";
        zone.style.left = x + "%";
        zone.style.top = y + "%";
        zone.style.width = "25%"; // Standard width
        zone.style.height = "12%"; // Standard height
        document.getElementById('map-layer').appendChild(zone);
        count++;
    };
}

// User Action: HD Crop
function activateCrop() {
    const image = document.getElementById('epaper-img');
    if (cropper) cropper.destroy();
    cropper = new Cropper(image, { viewMode: 1, autoCropArea: 0.3 });
}

function saveHD() {
    if (!cropper) return alert("Select area first!");
    const canvas = cropper.getCroppedCanvas({ width: 1600 }); // High Quality
    const link = document.createElement('a');
    link.download = 'Netivishwam-HD.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

// Share Logic
function shareToWA() {
    const blog = "nv7news.blogspot.com";
    const text = encodeURIComponent("Check Netivishwam Epaper: " + blog);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

let likes = 0;
function addReaction() {
    likes++;
    document.getElementById('l-count').innerText = likes;
}
