
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const yearElement = document.getElementById("year");

// ========================================
// ANNÉE AUTOMATIQUE
// ========================================

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ========================================
// MENU MOBILE
// ========================================

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const menuOuvert = navigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(menuOuvert)
        );

        menuToggle.setAttribute(
            "aria-label",
            menuOuvert ? "Fermer le menu" : "Ouvrir le menu"
        );
    });

    navigation.querySelectorAll("a").forEach((lien) => {
        lien.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        });
    });
}

// ========================================
// COMPTEUR DES TÉLÉCHARGEMENTS
// ========================================

const DEPOT_GITHUB = "ivanin302029/ivanin302029.github.io";
const NOM_FICHIER = "monbotpc.exe";
const INTERVALLE_ACTUALISATION = 5 * 60 * 1000;

let derniereActualisation = 0;
let compteurEnCours = false;

function creerCompteurTelechargements() {

    const section = document.querySelector(
        "#telecharger .download-content"
    );

    if (!section) {
        return null;
    }

    // Éviter de créer plusieurs compteurs.
    const existant = document.getElementById(
        "monbotpc-download-counter"
    );

    if (existant) {
        return existant;
    }

    const compteur = document.createElement("div");

    compteur.id = "monbotpc-download-counter";

    compteur.setAttribute("aria-live", "polite");

    compteur.style.cssText = `
        width:100%;
        max-width:320px;
        margin:28px auto;
        padding:24px 18px;
        box-sizing:border-box;
        text-align:center;
        background:#111827;
        border:1px solid #334155;
        border-radius:16px;
        box-shadow:0 12px 35px rgba(0,0,0,.22);
    `;

    const icone = document.createElement("div");

    icone.textContent = "↓";

    icone.style.cssText = `
        font-size:32px;
        color:#60A5FA;
        margin-bottom:8px;
    `;

    const nombre = document.createElement("div");

    nombre.id = "monbotpc-download-number";
    nombre.textContent = "Chargement...";

    nombre.style.cssText = `
        font-size:36px;
        font-weight:800;
        color:#60A5FA;
        line-height:1.2;
        font-variant-numeric:tabular-nums;
    `;

    const titre = document.createElement("div");

    titre.textContent = "NOMBRE DE TÉLÉCHARGEMENTS";

    titre.style.cssText = `
        margin-top:10px;
        font-size:12px;
        font-weight:700;
        letter-spacing:1px;
        color:#F8FAFC;
    `;

    const statut = document.createElement("div");

    statut.id = "monbotpc-download-status";
    statut.textContent = "Connexion à GitHub...";

    statut.style.cssText = `
        margin-top:10px;
        font-size:11px;
        color:#94A3B8;
    `;

    compteur.append(
        icone,
        nombre,
        titre,
        statut
    );

    const boutonTelechargement = section.querySelector(
        'a[href*="/releases/latest/download/MonBotPC.exe"]'
    );

    if (boutonTelechargement) {
        boutonTelechargement.insertAdjacentElement(
            "afterend",
            compteur
        );
    } else {
        section.appendChild(compteur);
    }

    return compteur;
}

// ========================================
// RÉCUPÉRER LES STATISTIQUES GITHUB
// ========================================

async function recupererNombreTelechargements() {

    if (compteurEnCours) {
        return;
    }

    const compteur = creerCompteurTelechargements();

    if (!compteur) {
        return;
    }

    const nombreElement = document.getElementById(
        "monbotpc-download-number"
    );

    const statutElement = document.getElementById(
        "monbotpc-download-status"
    );

    compteurEnCours = true;

    try {

        let total = 0;
        let page = 1;

        while (true) {

            const url =
                `https://api.github.com/repos/${DEPOT_GITHUB}/releases?per_page=100&page=${page}`;

            const reponse = await fetch(url, {
                headers: {
                    "Accept": "application/vnd.github+json"
                }
            });

            if (!reponse.ok) {
                throw new Error(
                    `GitHub API : erreur HTTP ${reponse.status}`
                );
            }

            const publications = await reponse.json();

            if (!Array.isArray(publications)) {
                throw new Error(
                    "Réponse GitHub invalide."
                );
            }

            for (const publication of publications) {

                const assets = Array.isArray(publication.assets)
                    ? publication.assets
                    : [];

                for (const asset of assets) {

                    if (
                        typeof asset.name === "string" &&
                        asset.name.toLowerCase() === NOM_FICHIER
                    ) {

                        total += Number(asset.download_count) || 0;

                    }

                }

            }

            if (publications.length < 100) {
                break;
            }

            page++;
        }

        nombreElement.textContent = total.toLocaleString("fr-CA");

        statutElement.textContent =
            "Statistiques GitHub · Actualisation automatique";

        derniereActualisation = Date.now();

    } catch (error) {

        console.error(
            "Erreur du compteur de téléchargements :",
            error
        );

        if (derniereActualisation === 0) {

            nombreElement.textContent = "Indisponible";

            statutElement.textContent =
                "Impossible de récupérer les statistiques.";

        } else {

            statutElement.textContent =
                "Actualisation temporairement indisponible.";

        }

    } finally {

        compteurEnCours = false;

    }
}

// ========================================
// DÉMARRAGE DU COMPTEUR
// ========================================

function demarrerCompteurTelechargements() {

    creerCompteurTelechargements();

    recupererNombreTelechargements();

    // Actualisation toutes les 5 minutes.
    setInterval(() => {

        recupererNombreTelechargements();

    }, INTERVALLE_ACTUALISATION);

    // Actualiser au retour sur le site si nécessaire.
    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState === "visible" &&
                Date.now() - derniereActualisation >=
                    INTERVALLE_ACTUALISATION
            ) {

                recupererNombreTelechargements();

            }

        }
    );
}

demarrerCompteurTelechargements();
