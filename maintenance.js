import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const config = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    appId: "1:691729637594:web:9564d52349c04809fe85e3"
};

const ADMIN_UID = "rWEk3vGHK1W2EDvemVfw6xNtKxU2";

const app = getApps().length
    ? getApp()
    : initializeApp(config);

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let maintenance = null;
let interval = null;

const overlay = document.createElement("div");

overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:#0B1120;
    z-index:999999;
    display:none;
    justify-content:center;
    align-items:center;
    padding:20px;
    color:white;
    font-family:Segoe UI,Arial,sans-serif;
`;

const card = document.createElement("div");

card.style.cssText = `
    background:#172033;
    border:1px solid #334155;
    padding:40px;
    border-radius:20px;
    text-align:center;
    width:100%;
    max-width:600px;
`;

const title = document.createElement("h1");
title.textContent = "🔧 Mon Bot PC";

const subtitle = document.createElement("h2");
subtitle.textContent = "Maintenance en cours";

const description = document.createElement("p");

description.textContent =
    "Nous préparons une mise à jour. Le site sera bientôt disponible.";

const timer = document.createElement("div");

timer.style.cssText = `
    font-size:clamp(32px,8vw,60px);
    font-weight:bold;
    color:#60A5FA;
    margin:30px 0;
    font-variant-numeric:tabular-nums;
`;

const labels = document.createElement("p");

labels.textContent = "Heures : Minutes : Secondes";

labels.style.color = "#94A3B8";

card.append(title, subtitle, description, timer, labels);

overlay.appendChild(card);

document.body.appendChild(overlay);

function updateMaintenance() {

    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    if (
        !maintenance ||
        maintenance.active !== true ||
        currentUser?.uid === ADMIN_UID
    ) {
        overlay.style.display = "none";
        document.body.style.overflow = "";
        return;
    }

    const endDate = maintenance.endsAt?.toDate?.();

    if (!endDate || endDate.getTime() <= Date.now()) {
        overlay.style.display = "none";
        document.body.style.overflow = "";
        return;
    }

    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    function tick() {

        const remaining = Math.max(
            0,
            Math.ceil((endDate.getTime() - Date.now()) / 1000)
        );

        if (remaining === 0) {

            overlay.style.display = "none";
            document.body.style.overflow = "";

            clearInterval(interval);
            interval = null;

            return;
        }

        const hours = Math.floor(remaining / 3600);

        const minutes = Math.floor(
            (remaining % 3600) / 60
        );

        const seconds = remaining % 60;

        timer.textContent =
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }

    tick();

    interval = setInterval(tick, 1000);
}

onAuthStateChanged(auth, user => {

    currentUser = user;

    updateMaintenance();

});

onSnapshot(
    doc(db, "site_settings", "maintenance"),

    snapshot => {

        maintenance = snapshot.exists()
            ? snapshot.data()
            : null;

        updateMaintenance();
    },

    error => {
        console.error("Erreur maintenance :", error);
    }
);
