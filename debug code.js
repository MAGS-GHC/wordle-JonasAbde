// Importerer et array med ord fra en ekstern fil med navnet "ord.js".
import { words } from "./ord.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialiserer to tomme arrays og en variabel til at holde styr på den aktuelle række.
  let valgteOrd = [];
  let gættedeBogstaver = [];
  let aktuelRække = 1;
  let hints = [];

  // Funktion til at generere et tilfældigt ord fra det importerede array.
  function getRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
  }

  // Funktion til at opdatere en HTML-boks med specifik id, tekstindhold, og CSS-klasse.
  function getAndUpdateBox(
    id,
    textContent,
    className,
    removeClass = false,
    customClass = ""
  ) {
    const box = document.getElementById(id);
    if (box) {
      box.textContent = textContent;

      // Fjerner eller tilføj klassen baseret på parameteren removeClass
      if (removeClass) {
        box.classList.remove(className);
      } else {
        box.classList.add(className);
      }

      // Håndter forskellige typer af gæt
      if (customClass) {
        box.classList.add(customClass);
      }
    }
  }

  // Funktion til at håndtere sletning af det seneste indtastede bogstav.
  function håndterSlet() {
    if (gættedeBogstaver.length > 0) {
      const sidsteBogstav = gættedeBogstaver.pop();
      const sidsteHint = hints.pop();

      // Opdater visningen ved at fjerne det sidste indtastede bogstav
      const sidsteBogstavIndex = gættedeBogstaver.length + 1;
      const boxId = `ord-${aktuelRække}-${sidsteBogstavIndex}`;

      if (sidsteHint === "grå") {
        getAndUpdateBox(boxId, "", "filled-box", true, "grå");
      } else if (sidsteHint === "gul") {
        getAndUpdateBox(boxId, "", "filled-box", true, "gul");
      } else if (sidsteHint === "grøn") {
        getAndUpdateBox(boxId, "", "filled-box", true, "grøn");
      } else {
        getAndUpdateBox(boxId, "", "filled-box", true);
      }

      // Opdater hint-bokse baseret på det seneste gæt.
      updateHintBoxes();

      // Hvis sidste gæt var korrekt, skal vi muligvis opdatere farven til rød igen.
      if (sidsteHint === "grøn") {
        // Håndter korrekt farve for korrekte gæt, der blev slettet.
        const sidsteGæt =
          valgteOrd[aktuelRække - 1][sidsteBogstavIndex - 1].toUpperCase();
        const sidsteBogstavLowerCase = sidsteBogstav.toLowerCase();

        if (sidsteGæt !== sidsteBogstavLowerCase) {
          const rigtigBoxId = `ord-${aktuelRække}-${sidsteBogstavIndex}`;
          getAndUpdateBox(
            rigtigBoxId,
            sidsteBogstav,
            "filled-box",
            false,
            "grøn"
          );
        }
      }
    }
  }

  // Funktion til at håndtere gæt af et bogstav.
  function håndterGæt(bogstav) {
    const boxId = `ord-${aktuelRække}-${gættedeBogstaver.length + 1}`;
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const bogstavIndex = gættedeBogstaver.length;

    // Tjek om bogstavet er i ordet
    if (korrektOrd.includes(bogstav)) {
      // Tjek om bogstavet er på den rigtige plads
      if (korrektOrd[bogstavIndex] === bogstav) {
        getAndUpdateBox(boxId, bogstav, "filled-box", false, "correct-box");
      } else {
        getAndUpdateBox(
          boxId,
          bogstav,
          "filled-box",
          false,
          "partially-correct-box"
        );
      }
    } else {
      getAndUpdateBox(boxId, bogstav, "filled-box", false, "wrong-box");
    }

    gættedeBogstaver.push(bogstav);

    // Funktion til at tjekke, om brugeren har gættet det rigtige ord efter fem bogstaver.
    if (gættedeBogstaver.length === 5) {
      console.log(
        "Gættet ord efter 5 bogstaver:",
        gættedeBogstaver.join("").toUpperCase()
      );
      tjekGæt(); // Brugeren har gættet ordet korrekt eller forkert.
    }

    // Opdater hint-boksene baseret på det seneste gæt.
    updateHintBoxes();
  }

  function updateHintBoxes() {
    for (let i = 1; i <= 3; i++) {
      const hintIndex = i - 1;

      // Tjek om hint eksisterer, før du bruger det
      if (hints[hintIndex]) {
        const hintClassName = hints[hintIndex].toLowerCase();
        getAndUpdateBox(
          `hint-${i}`,
          hints[hintIndex],
          "hint-box",
          false,
          hintClassName
        );
      } else {
        // Hvis hintet ikke eksisterer, skal du nulstille boksen
        getAndUpdateBox(`hint-${i}`, "", "hint-box", true);
      }
    }
  }

  // Funktion til at tjekke, om brugeren har gættet alle fem ord i den aktuelle række.
  function tjekGæt() {
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const gættetOrd = gættedeBogstaver.join("").toUpperCase();

    console.log("Korrekt ord:", korrektOrd);
    console.log("Gættet ord:", gættetOrd);
    console.log("Er ordene ens:", korrektOrd === gættetOrd);

    if (gættetOrd === korrektOrd) {
      alert("Tillykke! Du gættede ordet!");
      aktuelRække++;

      // Tjek, om spillet er gennemført efter fem rækker.
      if (aktuelRække > 5) {
        alert("Tillykke! Du har gennemført spillet!");
        aktuelRække = 1; // Nulstiller rækken for at starte forfra.
      } else {
        alert(`Du er nu på række ${aktuelRække}!`);
        updateHintBoxes();
        rydOrdBokse();
        gættedeBogstaver = [];
        hints = [];
      }
    } else {
      // Brugeren har gættet et ugyldigt ord.
      alert("Desværre, det var ikke det rigtige ord. Prøv igen!");
      gættedeBogstaver = [];
      hints = []; // Tilføjet nulstilling af hints-arrayet
      rydOrdBokse();
    }
  }

  // Funktion til at rydde boksene med gættede bogstaver og hints i den aktuelle række.
  function rydOrdBokse() {
    for (let i = 1; i <= 5; i++) {
      getAndUpdateBox(`ord-${aktuelRække}-${i}`, "", "filled-box", true);
    }

    for (let i = 1; i <= 3; i++) {
      getAndUpdateBox(`hint-${i}`, "", "hint-box", true);
    }
  }

  // Funktion til at håndtere sletning af det seneste indtastede bogstav.
  function håndterSlet() {
    if (gættedeBogstaver.length > 0) {
      const sidsteBogstav = gættedeBogstaver.pop();
      hints.pop();

      // Opdater visningen ved at fjerne det sidste indtastede bogstav
      const sidsteBogstavIndex = gættedeBogstaver.length + 1;
      const boxId = `ord-${aktuelRække}-${sidsteBogstavIndex}`;
      getAndUpdateBox(boxId, "", "filled-box", true);

      // Opdater hint-bokse baseret på det seneste gæt.
      updateHintBoxes();
    }
  }

  // Funktion til at tilføje event listeners på tastaturet for at håndtere brugerens input.
  function tilføjTastaturEventListeners() {
    window.addEventListener("keydown", (event) => {
      // Ignorer taster, der ikke er bogstaver fra det engelske tastatur
      if (/^[a-zA-Z]$/.test(event.key)) {
        const bogstav = event.key.toUpperCase();
        håndterGæt(bogstav);
      } else if (event.key === "Backspace") {
        // Slet det seneste indtastede bogstav ved backspace
        håndterSlet();
      }
    });
  }

  // Funktion til at initialisere spillet.
  function initialiserSpil() {
    // Hent et tilfældigt ord og gem det i valgteOrd-arrayet.
    valgteOrd = Array.from({ length: 5 }, () => getRandomWord(words));

    // Log orddata til konsollen (kan fjernes i den endelige version).
    console.log("Valgte ord:", valgteOrd);
  }

  initialiserSpil(); // Tilføjet denne linje for at kalde initialiserSpil-funktionen.
  tilføjTastaturEventListeners(); // Tilføjet denne linje for at tilføje tastatur-event listeners.
});
