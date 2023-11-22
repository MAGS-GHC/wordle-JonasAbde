// Importerer et array med ord fra en ekstern fil med navnet "ord.js".
import { words } from "./ord.js";

// Initialiserer to tomme arrays og en variabel til at holde styr på den aktuelle række.
let valgteOrd = [];
let gættedeBogstaver = [];
let aktuelRække = 1;

// Funktion til at generere et tilfældigt ord fra det importerede array.
function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// Funktion til at opdatere en HTML-boks med specifik id, tekstindhold, og CSS-klasse.
function getAndUpdateBox(id, textContent, className, removeClass = false) {
  const box = document.getElementById(id);
  if (box) {
    box.textContent = textContent;
    if (removeClass) {
      box.classList.remove(className);
    } else {
      box.classList.add(className);
    }
  }
}

// Funktion til at håndtere brugerens gæt på et bogstav.
function håndterGæt(bogstav) {
  bogstav = bogstav.toUpperCase();
  // Opdaterer visningen med det gættede bogstav i den aktuelle række.
  getAndUpdateBox(
    `ord-${aktuelRække}-${gættedeBogstaver.length + 1}`,
    bogstav,
    "filled-box"
  );
  gættedeBogstaver.push(bogstav);

  // Tjekker om brugeren har gættet det rigtige ord efter fem bogstaver.
  if (gættedeBogstaver.length === 5) {
    const gættetOrd = gættedeBogstaver.join("").toUpperCase();
    if (words.map((word) => word.toUpperCase()).includes(gættetOrd)) {
      tjekGæt(); // Brugeren har gættet ordet korrekt.
    } else {
      // Brugeren har gættet forkert ord.
      alert("Desværre, det var ikke det rigtige ord. Prøv igen!");
      gættedeBogstaver = [];
      rydOrdBokse();
    }
  }
}

// Funktion til at tjekke, om brugeren har gættet alle fem ord i den aktuelle række.
function tjekGæt() {
  alert("Tillykke! Du gættede ordet!");
  aktuelRække++;

  // Tjekker om spillet er gennemført efter fem rækker.
  if (aktuelRække > 5) {
    alert("Tillykke! Du har gennemført spillet!");
    aktuelRække = 1; // Nulstiller rækken for at starte forfra.
  } else {
    alert(`Du er nu på række ${aktuelRække}!`);
    rydOrdBokse();
    gættedeBogstaver = [];
  }
}

// Funktion til at rydde boksene med gættede bogstaver i den aktuelle række.
function rydOrdBokse() {
  for (let i = 1; i <= 5; i++) {
    getAndUpdateBox(`ord-${aktuelRække}-${i}`, "", "filled-box", true);
  }
}

// Funktion til at opdatere visningen af det valgte ord med gættede bogstaver.
function opdaterOrdVisning() {
  const ordKarakterer = valgteOrd[aktuelRække - 1].split("");
  ordKarakterer.forEach((karakter, index) => {
    if (gættedeBogstaver.includes(karakter)) {
      getAndUpdateBox(
        `ord-${aktuelRække}-${index + 1}`,
        karakter,
        "filled-box"
      );
    }
  });
}

// Funktion til at tilføje event listeners på tastaturet for at håndtere brugerens input.
function tilføjTastaturEventListeners() {
  window.addEventListener("keydown", (event) => {
    const bogstav = event.key.toUpperCase();
    håndterGæt(bogstav);
  });
}

// Funktion til at initialisere spillet ved indlæsning af DOM.
function initialiserSpil() {
  // Genererer fem tilfældige ord ved starten af spillet.
  for (let i = 0; i < 5; i++) {
    valgteOrd[i] = getRandomWord(words).toUpperCase();
  }
  tilføjTastaturEventListeners(); // Tilføjer event listeners til tastaturet.
}

// Lytter efter DOMContentLoaded-eventet og starter spillet ved indlæsning af DOM.
document.addEventListener("DOMContentLoaded", initialiserSpil);
