const BASE_URL = "https://ipwho.is";
let marker;

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

// --- Recherche d'une IP ---
async function fetchIP(ip) {
  const statusEl = document.getElementById("status");
  const infoEl = document.getElementById("info");
  const rawEl = document.getElementById("raw");

  statusEl.textContent = "Chargement…";
  infoEl.innerHTML = "";
  rawEl.textContent = "";

  try {
    const res = await fetch(`${BASE_URL}/${ip}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    renderInfo(data, infoEl, rawEl);

    statusEl.textContent = "Données chargées ✅";
  } catch (err) {
    statusEl.textContent = "Erreur : " + err.message;
  }
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
  const ipInput = document.getElementById("ipInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const ip = ipInput.value.trim();
    if (ip) fetchIP(ip);
  });

  ipInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const ip = ipInput.value.trim();
      if (ip) fetchIP(ip);
    }
  });
});
