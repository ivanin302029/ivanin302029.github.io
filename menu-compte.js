import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

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

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

const menuButton = document.getElementById(
    "monbot-menu-button"
);

const menu = document.getElementById(
    "monbot-menu"
);

const accountStatus = document.getElementById(
    "monbot-account-status"
);

const accountLink = document.getElementById(
    "monbot-account-link"
);

function fermerMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
}

function ouvrirMenu() {
    menu.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
}

menuButton.addEventListener("click", event => {

    event.stopPropagation();

    if (menu.hidden) {
        ouvrirMenu();
    } else {
        fermerMenu();
    }

});

document.addEventListener("click", event => {

    if (
        !menu.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {
        fermerMenu();
    }

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        fermerMenu();
    }

});

onAuthStateChanged(auth, user => {

    if (user) {

        accountStatus.textContent =
            "🟢 Connecté : " +
            (user.email || "Compte Google");

        accountStatus.style.color = "#22C55E";

        accountLink.textContent = "👤 Mon compte";

    } else {

        accountStatus.textContent = "🔴 Non connecté";

        accountStatus.style.color = "#EF4444";

        accountLink.textContent = "👤 Se connecter";

    }

});
