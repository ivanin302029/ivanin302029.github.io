import { initializeApp, getApps, getApp } from
"https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    storageBucket: "monbotpc.firebasestorage.app",
    messagingSenderId: "691729637594",
    appId: "1:691729637594:web:9564d52349c04809fe85e3",
    measurementId: "G-J2CSX1E919"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const style = document.createElement("style");

style.textContent = `
    #monbot-auth-status {
        position: fixed;
        top: 15x;
        right: 15px;
        z-index: 9999;
        padding: 11px 16px;
        background: #172033;
        border: 1px solid #334155;
        border-radius: 12px;
        color: white;
        font-family: "Segoe UI", Arial, sans-serif;
        font-size: 13px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        max-width: min(90vw, 350px);
        overflow-wrap: anywhere;
    }

    #monbot-auth-status a {
        color: #60A5FA;
        text-decoration: none;
        margin-left: 8px;
    }

    #monbot-auth-status .connected {
        color: #22C55E;
    }

    #monbot-auth-status .disconnected {
        color: #EF4444;
    }
`;

document.head.appendChild(style);

const status = document.createElement("div");

status.id = "monbot-auth-status";
status.textContent = "Vérification de la connexion...";

document.body.appendChild(status);

onAuthStateChanged(auth, user => {

    status.replaceChildren();

    const indicator = document.createElement("span");

    const link = document.createElement("a");

    link.href = "connexion.html";

    if (user) {

        indicator.className = "connected";

        indicator.textContent =
            "🟢 Connecté : " + (user.email || "Compte Google");

        link.textContent = "Mon compte";

    } else {

        indicator.className = "disconnected";

        indicator.textContent = "🔴 Non connecté";

        link.textContent = "Se connecter";

    }

    status.append(indicator, link);

});
