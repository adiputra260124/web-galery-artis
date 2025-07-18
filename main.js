// main.js (Versi Final dengan Iklan Native Terisolasi)

// ===================================================================
// PENGATURAN GLOBAL - HANYA EDIT BAGIAN INI
// ===================================================================

const GITHUB_USERNAME = 'adiputra260124';
const MAIN_REPO_NAME = 'web-galery-artis';
const GITHUB_REPO_BRANCH = 'main';
const GLOBAL_DIRECT_LINK = "https://caressfinancialdodge.com/e8e8ekz2we?key=d41e32129606fc3524b6e8c4db365ce9";
const DEFAULT_BIO = "Welcome to my personal blog!";

// <-- PERUBAHAN DI SINI: Tambahkan kode iklan native Anda
const GLOBAL_NATIVE_AD_CODE = `<script async="async" data-cfasync="false" src="//caressfinancialdodge.com/1a816c42d258481b15cb4e3972bf8e2e/invoke.js"><\/script><div id="container-1a816c42d258481b15cb4e3972bf8e2e"></div>`;

// ===================================================================
// LOGIKA UTAMA
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (Logika path tidak berubah) ...
});

// <-- PERUBAHAN DI SINI: Logika untuk menyisipkan iklan
async function loadHomePage() {
    const artistListContainer = document.getElementById('artist-list');
    if (!artistListContainer) return;

    const artistFolders = await fetchRepoContents('');
    
    let html = '';
    let artistCount = 0; // Counter untuk menghitung artis

    if (Array.isArray(artistFolders)) {
        for (const item of artistFolders) {
            if (item.type === 'dir') {
                artistCount++;
                
                const artistId = item.name;
                const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
                const fullName = artistId.replace(/_/g, ' ');
                const liveViewers = Math.floor(Math.random() * (5000 - 500 + 1) + 500);

                // Tambahkan HTML untuk kartu artis
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

                // Cek jika sudah 3 artis, sisipkan iklan
                if (artistCount % 3 === 0) {
                    // Bungkus kode iklan di dalam iframe untuk isolasi sempurna
                    const isolatedAdHtml = `<div class="ad-card">
                                                <iframe srcdoc="<html><body style='margin:0;padding:0;overflow:hidden;'>${GLOBAL_NATIVE_AD_CODE.replace(/"/g, '&quot;')}</body></html>"></iframe>
                                            </div>`;
                    html += isolatedAdHtml;
                }
            }
        }
    }
    artistListContainer.innerHTML = html;
}


// ... (Sisa fungsi-fungsi lain di main.js TIDAK BERUBAH) ...
async function loadArtistPage() { /* ... */ }
async function fetchRepoContents(path) { /* ... */ }
function renderProfile(artistId, fullName, postCount) { /* ... */ }
function renderGallery(items) { /* ... */ }
function setupEventListeners() { /* ... */ }
function showLightbox(url, type) { /* ... */ }
function generateThumbnail(galleryItem) { /* ... */ }
function updateSeoTags(artistData) { /* ... */ }
