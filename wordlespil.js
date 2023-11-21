import { words } from "./ord.js";

let valgtOrd;
let gættedeBogstaver = [];

// Vælg boksen hvor ordet vises
let ordBoks = document.getElementById("current-guess");

// Skjul boksen
ordBoks.style.display = "none";

// Funktion til at håndtere et gættet bogstav
function håndterGæt(bogstav) {
  bogstav = bogstav.toUpperCase();

  if (gættedeBogstaver.includes(bogstav)) {
    alert("Du har allerede gættet dette bogstav!");
    return;
  }

  gættedeBogstaver.push(bogstav);

  if (valgtOrd.includes(bogstav)) {
    opdaterOrdVisning();
  }

  tjekGæt();

  const listItem = document.createElement("li");
  listItem.textContent = bogstav;
  document.getElementById("guess-list").appendChild(listItem);
}

// Funktion til at tjekke om det gættede ord er korrekt
function tjekGæt() {
  const gættetOrd = gættedeBogstaver.join("");
  if (gættetOrd === valgtOrd) {
    alert("Tillykke! Du gættede ordet!");
    gættedeBogstaver.length = 0;
    visOrdPåBræt();
  }
}

// Funktion til at opdatere ordvisningen baseret på gættede bogstaver
function opdaterOrdVisning() {
  const ordKarakterer = valgtOrd.split("");

  ordKarakterer.forEach((karakter, index) => {
    if (gættedeBogstaver.includes(karakter)) {
      const boks = document.getElementById(`ord-${index + 0}`);
      boks.textContent = karakter;
      boks.classList.add("filled-box");
    }
  });
}

// Funktion til at vise det valgte ord på spillebrættet
function visOrdPåBræt() {
  // Gør ingenting
}

// Tilføj event listeners til tastaturknapper
function tilføjTastaturEventListeners() {
  window.addEventListener("keydown", (event) => {
    const bogstav = event.key.toUpperCase();
    håndterGæt(bogstav);
  });
}

// Initialiser spillet
function initialiserSpil() {
  valgtOrd = words[Math.floor(Math.random() * words.length)];
  visOrdPåBræt();

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        opdaterOrdVisning();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  tilføjTastaturEventListeners();
}

// Kald initialiserSpil funktionen når siden er indlæst
document.addEventListener("DOMContentLoaded", initialiserSpil);
