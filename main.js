// main.js (Versi Baru dengan Tampilan Homepage Elegan)

// ... (Bagian Pengaturan Global tidak berubah) ...
const GITHUB_USERNAME = 'adiputra260124'; 
const MAIN_REPO_NAME = 'web-galery-artis';
const GITHUB_REPO_BRANCH = 'main';
const GLOBAL_DIRECT_LINK = "https://caressfinancialdodge.com/e8e8ekz2we?key=d41e32129606fc3524b6e8c4db365ce9";
const DEFAULT_BIO = "Welcome to my personal blog!";

document.addEventListener('DOMContentLoaded', () => {
    // ... (Logika path tidak berubah) ...
});

// ===================================================================
// PERUBAHAN UTAMA DI SINI
// ===================================================================
async function loadHomePage() {
    const artistListContainer = document.getElementById('artist-list');
    if (!artistListContainer) return;

    const artistFolders = await fetchRepoContents('');

    let html = '';
    if (Array.isArray(artistFolders)) {
        for (const item of artistFolders) {
            if (item.type === 'dir') {
                const artistId = item.name;
                const profilePicUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${MAIN_REPO_NAME}@${GITHUB_REPO_BRANCH}/${artistId}/profile.jpg`;
                const fullName = artistId.replace(/_/g, ' ');
                // Simulasi jumlah penonton live
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
                                    <i class="fas fa-eye"></i>
                                    <span>${(liveViewers / 1000).toFixed(1)}k</span>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
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
