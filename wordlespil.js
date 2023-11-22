// Importerer et array med ord fra en ekstern fil med navnet "ord.js".
import { words } from "./ord.js";

document.addEventListener("DOMContentLoaded", () => {
  let valgteOrd = [];
  let gættedeBogstaver = [];
  let aktuelRække = 1;
  let hints = [];

  function getRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
  }

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
      removeClass
        ? box.classList.remove(className)
        : box.classList.add(className);
      if (customClass) box.classList.add(customClass);
    }
  }

  function håndterSlet() {
    console.log("Håndter slet kaldt");
    if (gættedeBogstaver.length > 0) {
      const sidsteBogstav = gættedeBogstaver.pop();
      const sidsteHint = hints.pop();
      const sidsteBogstavIndex = gættedeBogstaver.length + 1;
      const boxId = `ord-${aktuelRække}-${sidsteBogstavIndex}`;
      getAndUpdateBox(boxId, "", "filled-box", true, sidsteHint);
      updateHintBoxes();
    }
  }

  function håndterGæt(bogstav) {
    console.log(`Håndter gæt kaldt med bogstav: ${bogstav}`);
    const boxId = `ord-${aktuelRække}-${gættedeBogstaver.length + 1}`;
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const bogstavIndex = gættedeBogstaver.length;
    let boxClass = "wrong-box";

    if (korrektOrd.includes(bogstav)) {
      boxClass =
        korrektOrd[bogstavIndex] === bogstav
          ? "correct-box"
          : "partially-correct-box";
    }

    getAndUpdateBox(boxId, bogstav, "filled-box", false, boxClass);
    gættedeBogstaver.push(bogstav);

    if (gættedeBogstaver.length === 5) {
      tjekGæt();
    }

    updateHintBoxes();
  }

  function updateHintBoxes() {
    for (let i = 1; i <= 3; i++) {
      const hintIndex = i - 1;
      const hintClassName = hints[hintIndex]
        ? hints[hintIndex].toLowerCase()
        : "";
      getAndUpdateBox(
        `hint-${i}`,
        hints[hintIndex] || "",
        "hint-box",
        !hints[hintIndex],
        hintClassName
      );
    }
  }

  function tjekGæt() {
    console.log("Tjek gæt kaldt");
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const gættetOrd = gættedeBogstaver.join("").toUpperCase();

    if (gættetOrd === korrektOrd) {
      alert("Tillykke! Du gættede ordet!");
      aktuelRække++;
      if (aktuelRække > 5) {
        alert("Tillykke! Du har gennemført spillet!");
        aktuelRække = 1;
      } else {
        alert(`Du er nu på række ${aktuelRække}!`);
        rydOrdBokse();
        gættedeBogstaver = [];
        hints = [];
      }
    } else {
      alert("Desværre, det var ikke det rigtige ord. Prøv igen!");
      gættedeBogstaver = [];
      hints = [];
      rydOrdBokse();
    }
  }

  function rydOrdBokse() {
    console.log("Ryd ord bokse kaldt");
    for (let i = 1; i <= 5; i++) {
      getAndUpdateBox(`ord-${aktuelRække}-${i}`, "", "filled-box", true);
    }
    for (let i = 1; i <= 3; i++) {
      getAndUpdateBox(`hint-${i}`, "", "hint-box", true);
    }
  }

  function tilføjTastaturEventListeners() {
    window.addEventListener("keydown", (event) => {
      if (/^[a-zA-Z]$/.test(event.key)) {
        const bogstav = event.key.toUpperCase();
        håndterGæt(bogstav);
      } else if (event.key === "Backspace") {
        håndterSlet();
      }
    });
  }

  function initialiserSpil() {
    valgteOrd = Array.from({ length: 5 }, () => getRandomWord(words));
    console.log("Valgte ord:", valgteOrd);
  }

  initialiserSpil();
  tilføjTastaturEventListeners();
});
