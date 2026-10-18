import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {
    apiKey: "AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain: "monbotpc.firebaseapp.com",
    projectId: "monbotpc",
    storageBucket: "monbotpc.firebasestorage.app",
    messagingSenderId: "691729637594",
    appId: "1:691729637594:web:9564d52349c04809fe85e3"
};

/* ADMINISTRATEURS */

const ADMIN_UIDS = [
    "rWEk3vGHK1W2EDvemVfw6xNtKxU2",
    "8lq3zxa8nkdZ6hXpa8FeZTpI55Q2"
];

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

/* INITIALISATION */

function initialiserMenu() {

    const bouton = document.getElementById("mbpc-more");
    const menu = document.getElementById("mbpc-dropdown");
    const statut = document.getElementById("mbpc-status");
    const compte = document.getElementById("mbpc-account");

    if (!bouton || !menu) {
        console.warn("Menu Mon Bot PC introuvable.");
        return;
    }

    /* MENU */

    function fermerMenu() {
        menu.hidden = true;
        menu.style.setProperty(
            "display",
            "none",
            "important"
        );

        bouton.setAttribute("aria-expanded", "false");
    }

    function ouvrirMenu() {
        menu.hidden = false;

        menu.style.setProperty(
            "display",
            "block",
            "important"
        );

        menu.style.position = "absolute";
        menu.style.zIndex = "99999";

        bouton.setAttribute("aria-expanded", "true");
    }

    fermerMenu();

    bouton.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        if (menu.hidden) {
            ouvrirMenu();
        } else {
            fermerMenu();
        }

    });

    document.addEventListener("click", function(event) {

        if (
            !bouton.contains(event.target) &&
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

    /* LIENS */

    function ajouterLien(id, texte, adresse) {

        let lien = document.getElementById(id);

        if (!lien) {
            lien = document.createElement("a");
            lien.id = id;
            menu.appendChild(lien);
        }

        lien.textContent = texte;
        lien.href = adresse;

        return lien;
    }

    const lienActualites = ajouterLien(
        "mbpc-news-link",
        "📰 Actualités",
        "actualites.html"
    );

    const lienContact = ajouterLien(
        "mbpc-contact-link",
        "📩 Assistance",
        "contact.html"
    );

    const lienAdmin = ajouterLien(
        "mbpc-admin-link",
        "⚙️ Administration",
        "admin.html"
    );

    lienAdmin.style.display = "none";

    /* CONNEXION */

    onAuthStateChanged(auth, function(user) {

        const estAdmin = user &&
            ADMIN_UIDS.includes(user.uid);

        lienAdmin.style.display = estAdmin
            ? "block"
            : "none";

        if (statut) {
            statut.textContent = user
                ? "🟢 Connecté"
                : "🔴 Non connecté";
        }

        if (compte) {
            compte.textContent = user
                ? "👤 Mon compte"
                : "👤 Se connecter";

            compte.href = "connexion.html";
        }

    });

    /* NOTIFICATIONS ACTUALITÉS */

    async function chargerNotifications() {

        try {

            const snapshot = await getDocs(
                collection(db, "news")
            );

            let actualitesLues = [];

            try {
                const sauvegarde = JSON.parse(
                    localStorage.getItem(
                        "monbotpc_news_lues"
                    ) || "[]"
                );

                if (Array.isArray(sauvegarde)) {
                    actualitesLues = sauvegarde;
                }

            } catch (erreur) {
                actualitesLues = [];
            }

            const nouvelles = snapshot.docs.filter(
                document => !actualitesLues.includes(
                    document.id
                )
            );

            let badge = document.getElementById(
                "mbpc-news-badge"
            );

            if (!badge) {
                badge = document.createElement("span");
                badge.id = "mbpc-news-badge";

                badge.style.cssText = `
                    background:#EF4444;
                    color:white;
                    border-radius:20px;
                    padding:2px 7px;
                    margin-left:8px;
                    font-size:11px;
                    font-weight:bold;
                `;

                lienActualites.appendChild(badge);
            }

            badge.textContent = nouvelles.length;

            badge.style.display = nouvelles.length > 0
                ? "inline-block"
                : "none";

        } catch (erreur) {

            console.error(
                "Notifications indisponibles :",
                erreur
            );

        }

    }

    chargerNotifications();

}

/* ATTENDRE LE CHARGEMENT DU HTML */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialiserMenu
    );

} else {

    initialiserMenu();

}
