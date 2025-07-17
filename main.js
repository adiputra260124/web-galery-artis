// main.js (Versi Final - Sepenuhnya Otomatis)

// ===================================================================
// PENGATURAN GLOBAL - HANYA EDIT BAGIAN INI
// ===================================================================

// Ganti dengan username GitHub Anda
const GITHUB_USERNAME = 'adiputra260124'; 
// Ganti dengan nama repositori utama Anda
const MAIN_REPO_NAME = 'web-galery-artis'; 
const GITHUB_REPO_BRANCH = 'main';

// Ganti dengan SATU-SATUNYA link iklan direct link Anda
const GLOBAL_DIRECT_LINK = "https://caressfinancialdodge.com/e8e8ekz2we?key=d41e32129606fc3524b6e8c4db365ce9";

const DEFAULT_BIO = "Welcome to my personal blog!";

// ===================================================================
// LOGIKA UTAMA (Tidak Perlu Diubah)
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    if (path === 'index.html' || path === '') {
        loadHomePage();
    } else if (path === 'artist.html') {
        loadArtistPage();
    }
});

async function loadHomePage() {
    const artistListContainer = document.getElementById('artist-list');
    const artistFolders = await fetchRepoContents(''); 

    let html = '';
    if (Array.isArray(artistFolders)) {
        for (const item of artistFolders) {
            if (item.type === 'dir') {
                const artistId = item.name;
                const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
                const fullName = artistId.replace(/_/g, ' '); 
                
                html += `
                    <a href="artist.html?id=${artistId}" class="artist-card">
                        <img src="${profilePicUrl}" alt="${fullName}" class="artist-card-img" onerror="this.src='https://via.placeholder.com/300x400.png?text=No+Image'">
                        <div class="artist-card-overlay">
                            <h3>${fullName}</h3>
                            <span>@${artistId.toLowerCase()}</span>
                        </div>
                    </a>
                `;
            }
        }
    }
    artistListContainer.innerHTML = html;
}

async function loadArtistPage() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';

    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');

    if (!artistId) {
        document.body.innerHTML = '<h1>Artis tidak ditemukan.</h1>';
        return;
    }

    const fullName = artistId.replace(/_/g, ' ');
    document.title = fullName;

    const [videoFiles, photoFiles] = await Promise.all([
        fetchRepoContents(`${artistId}/videos/`),
        fetchRepoContents(`${artistId}/photos/`)
    ]);

    let galleryItems = [];
    if (Array.isArray(videoFiles)) { videoFiles.forEach(file => file.name.endsWith('.mp4') && galleryItems.push({ type: 'video', url: file.download_url })); }
    if (Array.isArray(photoFiles)) { photoFiles.forEach(file => file.name.match(/\.(jpg|jpeg|png|gif)$/) && galleryItems.push({ type: 'image', url: file.download_url })); }
    galleryItems.sort(() => Math.random() - 0.5);

    renderProfile(artistId, fullName, galleryItems.length);
    renderGallery(galleryItems);
    setupEventListeners();

    loadingOverlay.style.display = 'none';
}

// ===================================================================
// FUNGSI RENDER & BANTUAN (Tidak Perlu Diubah)
// ===================================================================

async function fetchRepoContents(path) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${MAIN_REPO_NAME}/contents/${path}?ref=${GITHUB_REPO_BRANCH}`;
    try {
        const response = await fetch(apiUrl, { headers: { 'User-Agent': 'artist-gallery-v3' } });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) { return []; }
}

function renderProfile(artistId, fullName, postCount) {
    const header = document.getElementById('profile-header');
    const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
    
    header.innerHTML = `
        <img class="profile-avatar" src="${profilePicUrl}" alt="Foto Profil" onerror="this.style.display='none'">
        <div class="profile-info">
            <div class="profile-title">
                <h1 class="profile-username">${artistId.toLowerCase()}</h1>
                <button class="btn direct-link-trigger">Ikuti</button>
                <button id="share-profile-btn" class="btn"><i class="fas fa-share-alt"></i> Bagikan Profil</button>
            </div>
            <div class="profile-stats">
                <div><strong>${postCount}</strong> postingan</div>
            </div>
            <div class="profile-bio">
                <h2 class="profile-name">${fullName}</h2>
                <p>${DEFAULT_BIO}</p>
                <div class="social-links">
                    <a href="#" class="direct-link-trigger"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="direct-link-trigger"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="direct-link-trigger"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="direct-link-trigger"><i class="fab fa-youtube"></i></a>
                    <a href="#" class="direct-link-trigger"><i class="fab fa-tiktok"></i></a>
                </div>
            </div>
        </div>`;
}

function renderGallery(items) {
    const grid = document.getElementById('gallery-grid');
    let html = '';
    items.forEach(item => {
        if (item.type === 'video') {
            html += `<div class="gallery-item video-thumb" data-type="video" data-url="${item.url}"><div class="gallery-overlay"><i class="fas fa-play"></i></div></div>`;
        } else if (item.type === 'image') {
            html += `<div class="gallery-item" data-type="image" style="background-image: url(${item.url})" data-url="${item.url}"><div class="gallery-overlay"><i class="fas fa-image"></i></div></div>`;
        }
    });
    grid.innerHTML = html;
}

function setupEventListeners() {
    const openDirectLink = () => window.open(GLOBAL_DIRECT_LINK, '_blank');

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.direct-link-trigger, .gallery-item, .profile-avatar')) {
             e.preventDefault();
             openDirectLink();
        }

        const galleryItem = e.target.closest('.gallery-item[data-type]');
        if (galleryItem) {
            showLightbox(galleryItem.dataset.url, galleryItem.dataset.type);
        }
    });

    const shareProfileBtn = document.getElementById('share-profile-btn');
    if(shareProfileBtn) {
        shareProfileBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({ title: document.title, text: `Lihat galeri dari ${document.title}`, url: window.location.href });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link profil disalin ke clipboard!');
            }
        });
    }
}

function showLightbox(url, type) {
    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const shareBtn = document.getElementById('share-content-btn');
    const downloadBtn = document.getElementById('download-content-btn');
    
    if (type === 'video') {
        content.innerHTML = `<video src="${url}" controls autoplay></video>`;
    } else if (type === 'image') {
        content.innerHTML = `<img src="${url}">`;
    }
    
    shareBtn.onclick = () => {
        if(navigator.share) {
            navigator.share({ title: 'Konten Keren', text: 'Lihat konten ini!', url: window.location.href });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link konten disalin ke clipboard!');
        }
    };

    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    lightbox.style.display = 'flex';
    document.getElementById('lightbox-close').onclick = () => lightbox.style.display = 'none';
}

// Fungsi untuk generate thumbnail (tidak berubah)
function generateThumbnail(galleryItem) {
    const videoUrl = galleryItem.dataset.url;
    if (!videoUrl) return;
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.preload = 'metadata';
    video.muted = true;
    video.currentTime = 1;
    video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        galleryItem.style.backgroundImage = `url(${canvas.toDataURL()})`;
    };
}
// ===================================================================
// FUNGSI BARU UNTUK MENGURUS SEO
// ===================================================================
function updateSeoTags(artistData) {
    const { id, fullName } = artistData;

    // Memperbarui Judul Halaman secara dinamis
    document.title = `${fullName} - Viral Videos & Photo Gallery`;

    // Memperbarui Deskripsi Halaman secara dinamis
    const description = `Watch exclusive viral videos and browse the latest HD photo gallery of ${fullName} (@${id.toLowerCase()}). Discover new content updated daily.`;
    document.querySelector('meta[name="description"]').setAttribute('content', description);

    // Memperbarui Kata Kunci secara dinamis
    const keywords = `${fullName}, ${id}, viral videos, photo gallery, influencer, selebgram, instagram model, exclusive content`;
    document.querySelector('meta[name="keywords"]').setAttribute('content', keywords);

    // Membuat Structured Data (untuk hasil pencarian yang lebih kaya)
    let schemaScript = document.getElementById('schema-org-script');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-org-script';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": fullName,
        "alternateName": id.toLowerCase(),
        "description": DEFAULT_BIO,
        "image": `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${id}/profile.jpg`,
        "url": window.location.href,
        "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href }
    };
    schemaScript.textContent = JSON.stringify(schemaData);
}
