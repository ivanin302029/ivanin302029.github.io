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

const ADMIN_UID = "rWEk3vGHK1W2EDvemVfw6xNtKxU2";

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Compatible avec les deux versions de ton index.html
const menuButton = document.getElementById("monbot-menu-button")
    || document.getElementById("mbpc-more");

const menu = document.getElementById("monbot-menu")
    || document.getElementById("mbpc-dropdown");

const accountStatus = document.getElementById("monbot-account-status")
    || document.getElementById("mbpc-status");

const accountLink = document.getElementById("monbot-account-link")
    || document.getElementById("mbpc-account");

if (!menuButton || !menu) {
    console.error("Menu Mon Bot PC introuvable dans index.html");
} else {

    function fermerMenu() {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", event => {
        event.stopPropagation();

        menu.hidden = !menu.hidden;

        menuButton.setAttribute(
            "aria-expanded",
            String(!menu.hidden)
        );
    });

    menu.addEventListener("click", event => {
        event.stopPropagation();
    });

    document.addEventListener("click", fermerMenu);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") fermerMenu();
    });

    // On crée le lien Administration s'il n'existe pas.
    let adminLink = document.getElementById("monbot-admin-link");

    if (!adminLink) {
        adminLink = document.createElement("a");
        adminLink.id = "monbot-admin-link";
        adminLink.href = "admin.html";
        adminLink.textContent = "⚙️ Administration";
        menu.appendChild(adminLink);
    }

    adminLink.hidden = true;
    adminLink.style.display = "none";

    onAuthStateChanged(auth, user => {

        if (accountStatus) {
            accountStatus.textContent = user
                ? "🟢 Connecté : " + (user.email || "Compte Google")
                : "🔴 Non connecté";
        }

        if (accountLink) {
            accountLink.href = "connexion.html";

            accountLink.textContent = user
                ? "👤 Mon compte"
                : "👤 Se connecter";
        }

        const isAdmin = user?.uid === ADMIN_UID;

        adminLink.hidden = !isAdmin;
        adminLink.style.display = isAdmin ? "block" : "none";
    });
}

// Notifications des actualités non lues
async function afficherNotifications() {

    try {
        const snapshot = await getDocs(collection(db, "news"));

        const articles = snapshot.docs.map(doc => doc.id);

        // Les actualités déjà consultées dans ce navigateur
        const lues = JSON.parse(
            localStorage.getItem("monbotpc_news_lues") || "[]"
        );

        const nouvelles = articles.filter(id => !lues.includes(id));

        const liens = document.querySelectorAll(
            'a[href="actualites.html"]'
        );

        liens.forEach(lien => {

            const ancienBadge = lien.querySelector(".news-badge");

            if (ancienBadge) ancienBadge.remove();

            if (nouvelles.length === 0) return;

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
        console.error("Notifications actualités :", error);
    }
}

afficherNotifications();

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Compatible avec les deux versions de ton index.html
const menuButton = document.getElementById("monbot-menu-button")
    || document.getElementById("mbpc-more");

const menu = document.getElementById("monbot-menu")
    || document.getElementById("mbpc-dropdown");

const accountStatus = document.getElementById("monbot-account-status")
    || document.getElementById("mbpc-status");

const accountLink = document.getElementById("monbot-account-link")
    || document.getElementById("mbpc-account");

if (!menuButton || !menu) {
    console.error("Menu Mon Bot PC introuvable dans index.html");
} else {

    function fermerMenu() {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", event => {
        event.stopPropagation();

        menu.hidden = !menu.hidden;

        menuButton.setAttribute(
            "aria-expanded",
            String(!menu.hidden)
        );
    });

    menu.addEventListener("click", event => {
        event.stopPropagation();
    });

    document.addEventListener("click", fermerMenu);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") fermerMenu();
    });

    // On crée le lien Administration s'il n'existe pas.
    let adminLink = document.getElementById("monbot-admin-link");

    if (!adminLink) {
        adminLink = document.createElement("a");
        adminLink.id = "monbot-admin-link";
        adminLink.href = "admin.html";
        adminLink.textContent = "⚙️ Administration";
        menu.appendChild(adminLink);
    }

    adminLink.hidden = true;
    adminLink.style.display = "none";

    onAuthStateChanged(auth, user => {

        if (accountStatus) {
            accountStatus.textContent = user
                ? "🟢 Connecté : " + (user.email || "Compte Google")
                : "🔴 Non connecté";
        }

        if (accountLink) {
            accountLink.href = "connexion.html";

            accountLink.textContent = user
                ? "👤 Mon compte"
                : "👤 Se connecter";
        }

        const isAdmin = user?.uid === ADMIN_UID;

        adminLink.hidden = !isAdmin;
        adminLink.style.display = isAdmin ? "block" : "none";
    });
}

// Notifications des actualités non lues
async function afficherNotifications() {

    try {
        const snapshot = await getDocs(collection(db, "news"));

        const articles = snapshot.docs.map(doc => doc.id);

        // Les actualités déjà consultées dans ce navigateur
        const lues = JSON.parse(
            localStorage.getItem("monbotpc_news_lues") || "[]"
        );

        const nouvelles = articles.filter(id => !lues.includes(id));

        const liens = document.querySelectorAll(
            'a[href="actualites.html"]'
        );

        liens.forEach(lien => {

            const ancienBadge = lien.querySelector(".news-badge");

            if (ancienBadge) ancienBadge.remove();

            if (nouvelles.length === 0) return;

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
        console.error("Notifications actualités :", error);
    }
}

afficherNotifications();
