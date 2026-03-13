let isMapping = false;
let mappedAreas = []; // To store 10 news coordinates

// 1. Role Check (Using your credentials)
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();
    
    // Fixed typo from 'gamil' to 'gmail'
    if ((email === "hannu@gmail.com" && pass === "6301505699") || 
        (email === "masoodv6.in@gmail.com" && pass === "hannu6301505699")) {
        
        document.getElementById('admin-panel').classList.remove('d-none');
        document.getElementById('admin-name').innerText = email.split('@')[0];
        alert("Admin Access Granted");
    } else {
        alert("User Mode: Access Restricted to View/Crop only.");
    }
}

// 2. Area Mapping Logic (Admin only)
function startMapping() {
    isMapping = true;
    alert("Click on the image to mark news areas (Approx 10 items)");
    // Logic to capture X, Y coordinates on click
}

// 3. HD Crop & Download (For User)
function downloadHD() {
    if (!cropper) return alert("Select area first!");
    
    // Capture in high quality
    const canvas = cropper.getCroppedCanvas({
        width: 1600, // HD Quality
        imageSmoothingQuality: 'high'
    });
    
    const link = document.createElement('a');
    link.download = 'Netivishwam-News.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

// 4. Like/Dislike Counter
let likes = 0;
function react(type) {
    if (type === 'like') {
        likes++;
        document.getElementById('like-count').innerText = likes;
    }
    // Update to database logic can be added here
}

// 5. Sharing Logic
function shareToWA() {
    const domain = "nv7news.blogspot.com";
    const text = encodeURIComponent(`Read this news on Netivishwam: ${domain}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}
