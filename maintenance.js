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


const firebaseConfig = {
    apiKey:"AIzaSyAkH3gJ0OyXagfgTbZGF2FYnntQ7upfdWE",
    authDomain:"monbotpc.firebaseapp.com",
    projectId:"monbotpc",
    storageBucket:"monbotpc.firebasestorage.app",
    messagingSenderId:"691729637594",
    appId:"1:691729637594:web:9564d52349c04809fe85e3"
};

const ADMIN_UID="rWEk3vGHK1W2EDvemVfw6xNtKxU2";

const app=getApps().length?getApp():initializeApp(firebaseConfig);

const auth=getAuth(app);
const db=getFirestore(app);

let user=null;
let maintenance=null;
let timer=null;

const overlay=document.createElement("div");

overlay.id="maintenance-overlay";

overlay.style.cssText=`
    position:fixed;
    inset:0;
    z-index:999999;
    background:#0B1120;
    color:white;
    display:none;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:25px;
    font-family:"Segoe UI",Arial,sans-serif;
`;

const content=document.createElement("div");

content.style.cssText=`
    max-width:650px;
    width:100%;
    background:#172033;
    border:1px solid #334155;
    border-radius:20px;
    padding:40px 25px;
`;

const title=document.createElement("h1");
title.textContent="🔧 Mon Bot PC";

const subtitle=document.createElement("h2");
subtitle.textContent="Maintenance en cours";

const description=document.createElement("p");
description.textContent=
    "Nous préparons une mise à jour. Le site sera bientôt disponible.";

const countdown=document.createElement("div");

countdown.style.cssText=`
    font-size:42px;
    font-weight:bold;
    color:#3B82F6;
    margin:25px 0;
`;

content.append(title,subtitle,description,countdown);
overlay.append(content);
document.body.append(overlay);

function update(){

    if(timer){
        clearInterval(timer);
        timer=null;
    }

    if(!maintenance?.active || user?.uid===ADMIN_UID){
        overlay.style.display="none";
        document.body.style.overflow="";
        return;
    }

    overlay.style.display="flex";
    document.body.style.overflow="hidden";

    function tick(){

        const end=maintenance.endsAt?.toDate?.();

        if(!end){
            countdown.textContent="Retour prochainement";
            return;
        }

        const seconds=Math.max(
            0,
            Math.floor((end.getTime()-Date.now())/1000)
        );

        if(seconds===0){
            overlay.style.display="none";
            document.body.style.overflow="";
            clearInterval(timer);
            timer=null;
            return;
        }

        const h=Math.floor(seconds/3600);
        const m=Math.floor((seconds%3600)/60);
        const s=seconds%60;

        countdown.textContent=
            String(h).padStart(2,"0")+":"+
            String(m).padStart(2,"0")+":"+
            String(s).padStart(2,"0");
    }

    tick();
    timer=setInterval(tick,1000);
}

onAuthStateChanged(auth,current=>{
    user=current;
    update();
});

onSnapshot(
    doc(db,"site_settings","maintenance"),
    snapshot=>{
        maintenance=snapshot.exists()?snapshot.data():null;
        update();
    },
    error=>console.error("Maintenance :",error)
);
