// main.js (Versi Final dengan Fitur "See Next")

// ===================================================================
// PENGATURAN GLOBAL
// ===================================================================
const GITHUB_USERNAME = 'adiputra260124';
const MAIN_REPO_NAME = 'web-galery-artis';
const GITHUB_REPO_BRANCH = 'main';
const GLOBAL_DIRECT_LINK = "https://caressfinancialdodge.com/e8e8ekz2we?key=d41e32129606fc3524b6e8c4db365ce9";
const DEFAULT_BIO = "Welcome to my personal blog!";
const GLOBAL_NATIVE_AD_CODE = `<script async="async" data-cfasync="false" src="//caressfinancialdodge.com/1a816c42d258481b15cb4e3972bf8e2e/invoke.js"><\/script><div id="container-1a816c42d258481b15cb4e3972bf8e2e"></div>`;

// Variabel baru untuk fitur "See Next"
let allArtists = [];
let currentIndex = 0;
const INITIAL_LOAD_COUNT = 20;
const LOAD_MORE_COUNT = 10;

// ===================================================================
// LOGIKA UTAMA
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    if (path === 'index.html' || path === '' || path.startsWith('web-galery-artis')) {
        loadHomePage();
     } else if (path === 'artist.html' || path === 'artist') { // <--- PERUBAHAN DI SINI
        loadArtistPage();
    }
});

async function loadHomePage() {
    const artistListContainer = document.getElementById('artist-list');
    if (!artistListContainer) return;

    // 1. Ambil semua data artis sekali saja dan simpan
    const artistFolders = await fetchRepoContents('');
    if (Array.isArray(artistFolders)) {
        // Filter hanya direktori dan acak urutannya sekali di awal
        allArtists = artistFolders.filter(item => item.type === 'dir');
        allArtists.sort(() => Math.random() - 0.5); 
    }
    
    // Tampilkan hero background jika ada artis
    if (allArtists.length > 0) {
        displayHeroBackground();
    }

    // 2. Tampilkan 20 artis pertama
    currentIndex = 0;
    artistListContainer.innerHTML = ''; // Kosongkan container dulu
    appendArtists();
}

function appendArtists() {
    const artistListContainer = document.getElementById('artist-list');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Tentukan batas artis yang akan di-load
    const loadCount = (currentIndex === 0) ? INITIAL_LOAD_COUNT : LOAD_MORE_COUNT;
    const nextIndex = Math.min(currentIndex + loadCount, allArtists.length);
    
    let html = '';
    // Dapatkan jumlah artis yang sudah ada untuk melanjutkan penomoran iklan
    let artistCount = artistListContainer.querySelectorAll('.artist-card').length;

    for (let i = currentIndex; i < nextIndex; i++) {
        artistCount++;
        const artistId = allArtists[i].name;
        const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
        const fullName = artistId.replace(/_/g, ' ');
        const liveViewers = Math.floor(Math.random() * (5000 - 500 + 1) + 500);

        html += `
            <a href="artist.html?id=${artistId}" class="artist-card">
                <div class="artist-card-image-wrapper">
                    <img src="${profilePicUrl}" alt="${fullName}" class="artist-card-img" onerror="this.src='https://via.placeholder.com/300x400.png?text=Image+Not+Found'">
                </div>
                <div class="artist-card-info">
                    <h3>${fullName}</h3>
                    <div class="artist-card-details">
                        <span>@${artistId.toLowerCase()}</span>
                        <div class="artist-live-stats">
                            <div class="live-dot"></div>
                            <span>${(liveViewers / 1000).toFixed(1)}k</span>
                        </div>
                    </div>
                </div>
            </a>
        `;

        // Sisipkan iklan setiap kelipatan 3
        if (artistCount % 3 === 0) {
            const isolatedAdHtml = `<div class="ad-card"><iframe srcdoc="<html><body style='margin:0;padding:0;overflow:hidden;'>${GLOBAL_NATIVE_AD_CODE.replace(/"/g, '&quot;')}</body></html>"></iframe></div>`;
            html += isolatedAdHtml;
        }
    }
    
    // Tambahkan HTML baru ke container, bukan menggantinya
    artistListContainer.innerHTML += html;
    currentIndex = nextIndex;

    // Atur tombol "See Next"
    if (paginationContainer) {
        paginationContainer.innerHTML = ''; // Hapus tombol lama
        if (currentIndex < allArtists.length) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'See Next';
            loadMoreButton.className = 'btn-load-more';
            loadMoreButton.onclick = appendArtists;
            paginationContainer.appendChild(loadMoreButton);
        }
    }
}

function displayHeroBackground() {
    const randomArtistIndex = Math.floor(Math.random() * allArtists.length);
    const randomArtistFolder = allArtists[randomArtistIndex];
    const randomArtistId = randomArtistFolder.name;
    const heroImageUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${randomArtistId}/profile.jpg`;
    
    const heroBackground = document.createElement('div');
    heroBackground.className = 'hero-background';
    heroBackground.style.backgroundImage = `url('${heroImageUrl}')`;
    document.body.insertAdjacentElement('afterbegin', heroBackground);
}


// ===================================================================
// FUNGSI-FUNGSI LAIN (TIDAK BERUBAH)
// ===================================================================
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

    updateSeoTags({ id: artistId, fullName: fullName });

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

async function fetchRepoContents(path) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${MAIN_REPO_NAME}/contents/${path}?ref=${GITHUB_REPO_BRANCH}`;
    try {
        const response = await fetch(apiUrl, { headers: { 'User-Agent': 'artist-gallery-v4' } });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) { 
        console.error("Gagal fetch data dari GitHub:", error);
        return []; 
    }
}

function renderProfile(artistId, fullName, postCount) {
    const header = document.getElementById('profile-header');
    const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
    
    header.innerHTML = `
        <img class="profile-avatar" src="${profilePicUrl}" alt="Foto Profil ${fullName}" onerror="this.style.display='none'">
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
    const artistName = document.title.split(' - ')[0];

    items.forEach(item => {
        if (item.type === 'video') {
            html += `<div class="gallery-item video-thumb" data-type="video" data-url="${item.url}" title="Watch video of ${artistName}"><div class="gallery-overlay"><i class="fas fa-play"></i></div></div>`;
        } else if (item.type === 'image') {
            html += `<div class="gallery-item" data-type="image" style="background-image: url(${item.url})" data-url="${item.url}" title="Image of ${artistName}"><div class="gallery-overlay"><i class="fas fa-image"></i></div></div>`;
        }
    });
    grid.innerHTML = html;
    document.querySelectorAll('.video-thumb').forEach(item => generateThumbnail(item));
}

function setupEventListeners() {
    const openDirectLink = () => window.open(GLOBAL_DIRECT_LINK, '_blank');

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#share-profile-btn')) { return; }

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
        shareProfileBtn.addEventListener('click', (e) => {
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
        fetch(url).then(resp => resp.blob()).then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = url.split('/').pop();
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        }).catch(() => alert('Gagal mengunduh file.'));
    };

    lightbox.style.display = 'flex';
    document.getElementById('lightbox-close').onclick = () => lightbox.style.display = 'none';
}

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

function updateSeoTags(artistData) {
    const { id, fullName } = artistData;
    document.title = `${fullName} - Viral Videos & Photo Gallery`;
    const description = `Watch exclusive viral videos and browse the latest HD photo gallery of ${fullName} (@${id.toLowerCase()}). Discover new content updated daily.`;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    const keywords = `${fullName}, ${id}, viral videos, photo gallery, influencer, selebgram, instagram model, exclusive content`;
    document.querySelector('meta[name="keywords"]').setAttribute('content', keywords);
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
