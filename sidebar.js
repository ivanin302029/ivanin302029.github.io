import { initializeApp, getApps, getApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    storageBucket: "monbotpc.firebasestorage.app",
    messagingSenderId: "691729637594",
    appId: "1:691729637594:web:9564d52349c04809fe85e3",
    measurementId: "G-J2CSX1E919"
};

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);


const style = document.createElement("style");

style.textContent = `

    #monbot-sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 270px;
        height: 100vh;
        background: #111827;
        border-left: 1px solid #334155;
        padding: 25px 18px;
        z-index: 9999;
        font-family: "Segoe UI", Arial, sans-serif;
        color: white;
        overflow-y: auto;
        box-shadow: -10px 0 35px rgba(0,0,0,0.25);
        box-sizing: border-box;
    }

    #monbot-sidebar h2 {
        color: #3B82F6;
        font-size: 20px;
        margin-bottom: 25px;
    }

    #monbot-sidebar .sidebar-section {
        background: #172033;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
    }

    #monbot-sidebar .sidebar-title {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 12px;
    }

    #monbot-sidebar .sidebar-status {
        font-size: 13px;
        margin-bottom: 12px;
        overflow-wrap: anywhere;
        line-height: 1.6;
    }

    #monbot-sidebar .sidebar-button {
        display: block;
        text-decoration: none;
        text-align: center;
        background: #3B82F6;
        color: white;
        padding: 12px;
        border-radius: 9px;
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
    }

    #monbot-sidebar .sidebar-button:hover {
        background: #2563EB;
    }

    #monbot-sidebar .sidebar-contact {
        background: #8B5CF6;
    }

    #monbot-sidebar .sidebar-contact:hover {
        background: #7C3AED;
    }

    @media (min-width: 901px) {
        body {
            padding-right: 270px !important;
            box-sizing: border-box;
        }
    }

    @media (max-width: 900px) {

        #monbot-sidebar {
            position: relative;
            width: 100%;
            height: auto;
            border-left: none;
            border-top: 1px solid #334155;
            box-shadow: none;
        }

        body {
            padding-right: 0 !important;
        }
    }

`;

document.head.appendChild(style);


const sidebar = document.createElement("aside");

sidebar.id = "monbot-sidebar";

sidebar.innerHTML = `

    <h2>Mon Bot PC</h2>

    <div class="sidebar-section">

        <div class="sidebar-title">
            👤 Mon compte
        </div>

        <div class="sidebar-status" id="sidebar-account-status">
            Vérification...
        </div>

        <a href="connexion.html"
           class="sidebar-button"
           id="sidebar-account-button">

            Se connecter

        </a>

    </div>

    <div class="sidebar-section">

        <div class="sidebar-title">
            📩 Assistance
        </div>

        <p style="font-size:13px;color:#94A3B8;line-height:1.6;">
            Une question ou un problème avec Mon Bot PC ?
        </p>

        <a href="contact.html"
           class="sidebar-button sidebar-contact">

            Nous contacter

        </a>

    </div>

`;

document.body.appendChild(sidebar);


const accountStatus =
    document.getElementById("sidebar-account-status");

const accountButton =
    document.getElementById("sidebar-account-button");


onAuthStateChanged(auth, user => {

    if (user) {

        accountStatus.textContent =
            "🟢 Connecté : " +
            (user.email || "Compte Google");

        accountStatus.style.color = "#22C55E";

        accountButton.textContent = "Mon compte";

    } else {

        accountStatus.textContent = "🔴 Non connecté";

        accountStatus.style.color = "#EF4444";

        accountButton.textContent = "Se connecter";

    }

});
