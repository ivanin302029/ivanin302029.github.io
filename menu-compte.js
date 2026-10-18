import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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

const more = document.getElementById("mbpc-more");
const dropdown = document.getElementById("mbpc-dropdown");
const status = document.getElementById("mbpc-status");
const account = document.getElementById("mbpc-account");

const adminLink = document.createElement("a");

adminLink.href = "admin.html";
adminLink.textContent = "⚙️ Administration";
adminLink.hidden = true;

adminLink.style.cssText = `
    display:none;
    color:#FACC15;
    font-weight:bold;
`;

dropdown.appendChild(adminLink);

function closeMenu() {

    dropdown.hidden = true;

    more.setAttribute("aria-expanded", "false");
}

more.addEventListener("click", () => {

    dropdown.hidden = !dropdown.hidden;

    more.setAttribute(
        "aria-expanded",
        String(!dropdown.hidden)
    );
});

document.addEventListener("click", event => {

    if (!event.target.closest(".mbpc-menu-wrap")) {
        closeMenu();
    }
});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeMenu();
    }
});

onAuthStateChanged(auth, user => {

    if (user) {

        status.textContent =
            "🟢 Connecté : " +
            (user.email || "Compte Google");

        account.textContent = "👤 Mon compte";

    } else {

        status.textContent = "🔴 Non connecté";

        account.textContent = "👤 Se connecter";
    }

    const isAdmin = user?.uid === ADMIN_UID;

    adminLink.hidden = !isAdmin;

    adminLink.style.display = isAdmin ? "block" : "none";
});
