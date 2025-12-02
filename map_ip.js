const BASE_URL = "https://ipwho.is";

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

// --- Carte IP ---
async function fetchMapIP() {
  const input = document.getElementById("mapIpInput");
  const statusEl = document.getElementById("mapStatus");

  const ip = input.value.trim() || "8.8.8.8";

  statusEl.textContent = "Chargement...";

  try {
    const res = await fetch(`${BASE_URL}/${ip}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    const lat = data.latitude;
    const lon = data.longitude;

    if (!lat || !lon) throw new Error("Aucune localisation trouvée.");

    const mapOnly = initMap("mapOnly");
    mapOnly.setView([lat, lon], 8);

    L.marker([lat, lon])
      .addTo(mapOnly)
      .bindPopup(`<b>${data.ip}</b><br>${data.city || ""}, ${data.country || ""}`)
      .openPopup();

    statusEl.textContent = "Localisation trouvée ✅";
  } catch (err) {
    statusEl.textContent = "Erreur : " + err.message;
  }
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mapSearchBtn")
    .addEventListener("click", fetchMapIP);
});
