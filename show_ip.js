const BASE_URL = "https://ipwho.is";
let marker;

// --- Carte Leaflet ---
function initMap(mapId = "map") {
  const mapElement = document.getElementById(mapId);
  if (!mapElement) return null;

  const map = L.map(mapId).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  return map;
}

// --- Affichage des infos ---
function renderInfo(data, infoEl, rawEl) {
  const fields = [
    ["Adresse IP", data.ip],
    ["Ville", data.city],
    ["Région", data.region],
    ["Pays", data.country],
    ["Code pays", data.country_code],
    ["Fournisseur / Organisation", data.connection?.org],
    ["Latitude", data.latitude],
    ["Longitude", data.longitude],
    ["Fuseau horaire", data.timezone?.id]
  ];

  infoEl.innerHTML = "";

  for (const [key, val] of fields) {
    if (val !== undefined && val !== null) {
      const div = document.createElement("div");
      div.className = "info-item";
      div.innerHTML = `<div class="info-key">${key}</div><div>${val}</div>`;
      infoEl.appendChild(div);
    }
  }

  rawEl.textContent = JSON.stringify(data, null, 2);
}

// --- Mise à jour carte ---
function updateMap(data, mapRef) {
  if (!mapRef) return;

  const lat = data.latitude;
  const lon = data.longitude;

  if (!lat || !lon) return;

  mapRef.setView([lat, lon], 9);

  if (marker) marker.remove();

  marker = L.marker([lat, lon])
    .addTo(mapRef)
    .bindPopup(`<b>${data.ip}</b><br>${data.city || ""}, ${data.country || ""}`)
    .openPopup();
}

// --- IP du visiteur ---
async function fetchMyIP(mapRef) {
  const statusEl = document.getElementById("status");
  const infoEl = document.getElementById("info");
  const rawEl = document.getElementById("raw");

  statusEl.textContent = "Récupération de votre adresse IP…";

  try {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    renderInfo(data, infoEl, rawEl);
    updateMap(data, mapRef);

    statusEl.textContent = "Adresse IP détectée ✅";
  } catch (err) {
    statusEl.textContent = "Erreur : " + err.message;
  }
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
  const mapRef = initMap();
  fetchMyIP(mapRef);
});
