let newsCropper;
let isAdminMode = false;
let mapCount = 0;

// Admin Login
function showLoginPrompt() {
    const userEmail = prompt("Enter Gmail ID:");
    const userPass = prompt("Enter Password:");
    
    // Spelling check for 'gmail.com'
    if ((userEmail === "hannu@gmail.com" || userEmail === "masoodv6.in@gmail.com") && 
        (userPass === "6301505699" || userPass === "hannu6301505699")) {
        isAdminMode = true;
        document.getElementById('admin-panel').classList.remove('d-none');
        alert("Admin Access: Mapping Tool Enabled.");
    } else {
        alert("Standard User: Restricted to Crop and Share.");
    }
}

// Logic for Mapping 10 News Items
function initiateAreaMapping() {
    if (!isAdminMode) return;
    alert("Click on the image to define 10 news areas.");
    const imgEl = document.getElementById('epaper-image');
    
    imgEl.onclick = (event) => {
        if (mapCount >= 10) return alert("Reached limit of 10 mapped items.");
        
        const rect = imgEl.getBoundingClientRect();
        const posX = ((event.clientX - rect.left) / rect.width) * 100;
        const posY = ((event.clientY - rect.top) / rect.height) * 100;
        
        const zoneDiv = document.createElement('div');
        zoneDiv.className = "mapped-zone";
        zoneDiv.style.left = posX + "%";
        zoneDiv.style.top = posY + "%";
        zoneDiv.style.width = "25%"; // Default zone size
        zoneDiv.style.height = "12%";
        
        document.getElementById('mapping-layer').appendChild(zoneDiv);
        mapCount++;
    };
}

// User Actions: Crop and HD Download
function toggleCropTool() {
    const paperImg = document.getElementById('epaper-image');
    if (newsCropper) {
        newsCropper.destroy();
        newsCropper = null;
    } else {
        newsCropper = new Cropper(paperImg, { viewMode: 1, autoCropArea: 0.3 });
    }
}

function downloadHDClip() {
    if (!newsCropper) return alert("Please select a news area first!");
    
    // Maintain HD resolution
    const croppedCanvas = newsCropper.getCroppedCanvas({
        width: 1600,
        imageSmoothingQuality: 'high'
    });
    
    const downloadLink = document.createElement('a');
    downloadLink.download = 'Netivishwam-News-HD.jpg';
    downloadLink.href = croppedCanvas.toDataURL('image/jpeg', 1.0);
    downloadLink.click();
}

// WhatsApp Sharing
function shareToWhatsApp() {
    const newsUrl = "nv7news.blogspot.com";
    const shareText = encodeURIComponent("Check out this news from Netivishwam: " + newsUrl);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
}

let reactionCount = 0;
function handleReaction() {
    reactionCount++;
    document.getElementById('count-likes').innerText = reactionCount;
}
