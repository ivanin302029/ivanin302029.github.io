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
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ========================================
// FIREBASE
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    storageBucket: "monbotpc.firebasestorage.app",
    messagingSenderId: "691729637594",
    appId: "1:691729637594:web:9564d52349c04809fe85e3"
};

// ========================================
// ADMINISTRATEURS
// ========================================

const ADMIN_UIDS = [
    "rWEk3vGHK1W2EDvemVfw6xNtKxU2",
    "8lq3zxa8nkdZ6hXpa8FeZTpI55Q2"
];

// ========================================
// INITIALISATION
// ========================================

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// ========================================
// MENU DES TROIS POINTS
// ========================================

function initialiserMenu() {

    const menuButton =
        document.getElementById("monbot-menu-button") ||
        document.getElementById("mbpc-more");

    const menu =
        document.getElementById("monbot-menu") ||
        document.getElementById("mbpc-dropdown");

    const accountStatus =
        document.getElementById("monbot-account-status") ||
        document.getElementById("mbpc-status");

    const accountLink =
        document.getElementById("monbot-account-link") ||
        document.getElementById("mbpc-account");

    if (!menuButton || !menu) {

        console.error(
            "Impossible de trouver le bouton ou le menu."
        );

        return;
    }

    // ========================================
    // OUVERTURE / FERMETURE
    // ========================================

    function fermerMenu() {

        menu.hidden = true;

        menu.style.setProperty(
            "display",
            "none",
            "important"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function ouvrirMenu() {

        menu.hidden = false;

        menu.style.setProperty(
            "display",
            "block",
            "important"
        );

        menu.style.zIndex = "99999";

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    fermerMenu();

    menuButton.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        if (menu.hidden) {

            ouvrirMenu();

        } else {

            fermerMenu();

        }

    });

    menu.addEventListener("click", function(event) {

        event.stopPropagation();

    });

    document.addEventListener("click", function(event) {

        if (
            !menuButton.contains(event.target) &&
            !menu.contains(event.target)
        ) {

            fermerMenu();

        }

    });

    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {

            fermerMenu();

        }

    });

    // ========================================
    // ADMINISTRATION
    // ========================================

    let adminLink =
        document.getElementById("monbot-admin-link") ||
        document.getElementById("mbpc-admin-link");

    if (!adminLink) {

        adminLink = document.createElement("a");

        adminLink.id = "monbot-admin-link";

        adminLink.href = "admin.html";

        adminLink.textContent = "⚙️ Administration";

        menu.appendChild(adminLink);

    }

    adminLink.hidden = true;
    adminLink.style.display = "none";

    // ========================================
    // CONNEXION FIREBASE
    // ========================================

    onAuthStateChanged(auth, function(user) {

        const isAdmin =
            user !== null &&
            ADMIN_UIDS.includes(user.uid);

        if (accountStatus) {

            accountStatus.textContent = user
                ? "🟢 Connecté : " +
                  (user.email || "Compte Google")
                : "🔴 Non connecté";

        }

        if (accountLink) {

            accountLink.href = "connexion.html";

            accountLink.textContent = user
                ? "👤 Mon compte"
                : "👤 Se connecter";

        }

        adminLink.hidden = !isAdmin;

        adminLink.style.display = isAdmin
            ? "block"
            : "none";

    });

}

// ========================================
// NOTIFICATIONS ACTUALITÉS
// ========================================

async function afficherNotifications() {

    try {

        const snapshot = await getDocs(
            collection(db, "news")
        );

        const articles = snapshot.docs.map(
            document => document.id
        );

        let lues = [];

        try {

            const sauvegarde = JSON.parse(
                localStorage.getItem(
                    "monbotpc_news_lues"
                ) || "[]"
            );

            if (Array.isArray(sauvegarde)) {

                lues = sauvegarde;

            }

        } catch (error) {

            lues = [];

        }

        const nouvelles = articles.filter(
            id => !lues.includes(id)
        );

        const liens = document.querySelectorAll(
            'a[href="actualites.html"]'
        );

        liens.forEach(lien => {

            const ancienBadge =
                lien.querySelector(".news-badge");

            if (ancienBadge) {

                ancienBadge.remove();

            }

            if (nouvelles.length === 0) {

                return;

            }

            const badge = document.createElement("span");

            badge.className = "news-badge";

            badge.textContent = nouvelles.length > 99
                ? "99+"
                : nouvelles.length;

            badge.style.cssText = `
                display:inline-flex;
                align-items:center;
                justify-content:center;
                min-width:19px;
                height:19px;
                padding:0 5px;
                margin-left:6px;
                background:#EF4444;
                color:white;
                border-radius:20px;
                font-size:11px;
                font-weight:bold;
                vertical-align:middle;
            `;

            lien.appendChild(badge);

        });

    } catch (error) {

        console.error(
            "Erreur notifications :",
            error
        );

    }

}

// ========================================
// DÉMARRAGE
// ========================================

function demarrer() {

    initialiserMenu();

    afficherNotifications();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        demarrer
    );

} else {

    demarrer();

}
