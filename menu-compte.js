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

const firebaseConfig = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    storageBucket: "monbotpc.firebasestorage.app",
    messagingSenderId: "691729637594",
    appId: "1:691729637594:web:9564d52349c04809fe85e3"
};

const ADMINS = [
    "rWEk3vGHK1W2EDvemVfw6xNtKxU2",
    "8lq3zxa8nkdZ6hXpa8FeZTpI55Q2"
];

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const more = document.getElementById("mbpc-more");
const dropdown = document.getElementById("mbpc-dropdown");
const status = document.getElementById("mbpc-status");
const account = document.getElementById("mbpc-account");

function fermerMenu() {
    if (!dropdown || !more) return;

    dropdown.hidden = true;
    dropdown.style.display = "none";

    more.setAttribute("aria-expanded", "false");
}

function ouvrirMenu() {
    if (!dropdown || !more) return;

    dropdown.hidden = false;
    dropdown.style.display = "block";

    more.setAttribute("aria-expanded", "true");
}

if (more && dropdown) {
    fermerMenu();

    more.addEventListener("click", event => {
        event.stopPropagation();

        if (dropdown.hidden) {
            ouvrirMenu();
        } else {
            fermerMenu();
        }
    });

    document.addEventListener("click", event => {
        if (
            !more.contains(event.target) &&
            !dropdown.contains(event.target)
        ) {
            fermerMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fermerMenu();
        }
    });
}

let adminLink = document.getElementById("mbpc-admin-link");

if (!adminLink && dropdown) {
    adminLink = document.createElement("a");

    adminLink.id = "mbpc-admin-link";
    adminLink.href = "admin.html";
    adminLink.textContent = "⚙️ Administration";
    adminLink.style.display = "none";

    dropdown.appendChild(adminLink);
}

onAuthStateChanged(auth, user => {
    const administrateur = user && ADMINS.includes(user.uid);

    if (adminLink) {
        adminLink.style.display = administrateur
            ? "block"
            : "none";
    }

    if (status) {
        status.textContent = user
            ? "🟢 Connecté : " + (user.email || "Compte Google")
            : "🔴 Non connecté";
    }

    if (account) {
        account.textContent = user
            ? "👤 Mon compte"
            : "👤 Se connecter";

        account.href = "connexion.html";
    }
});

async function actualiserNotifications() {
    try {
        const snapshot = await getDocs(
            collection(db, "news")
        );

        const lus = JSON.parse(
            localStorage.getItem("monbotpc_news_lues") || "[]"
        );

        const nonLus = snapshot.docs.filter(
            document => !lus.includes(document.id)
        );

        document.querySelectorAll(
            'a[href="actualites.html"]'
        ).forEach(lien => {
            let badge = lien.querySelector(".news-badge");

            if (!badge) {
                badge = document.createElement("span");
                badge.className = "news-badge";
                badge.style.cssText = `
                    display:inline-block;
                    background:#EF4444;
                    color:white;
                    border-radius:20px;
                    padding:2px 7px;
                    margin-left:8px;
                    font-size:11px;
                    font-weight:bold;
                `;

                lien.appendChild(badge);
            }

            badge.textContent = nonLus.length;
            badge.style.display = nonLus.length
                ? "inline-block"
                : "none";
        });

    } catch (error) {
        console.error(
            "Impossible de charger les notifications :",
            error
        );
    }
}

actualiserNotifications();
