import { words } from "./ord.js"; // punkt 1 

document.addEventListener("DOMContentLoaded", () => {
  let valgteOrd = [];
  let gættedeBogstaver = [];
  let aktuelRække = 1;
  let hints = [];

  function getRandomWord(words) { // punkt 2
    return words[Math.floor(Math.random() * words.length)];
  }

  function getAndUpdateBox( // punkt 3
    id,
    textContent,
    className,
    removeClass = false,
    customClass = ""
  ) {
    const box = document.getElementById(id);
    if (box) {
      box.textContent = textContent;

      if (removeClass) {
        box.classList.remove(className);
      } else {
        box.classList.add(className);
      }

      if (customClass) {
        box.classList.add(customClass);
      }
    }
  }

  function getBoxColorClass(hint) { 
    const colorMap = { grå: "grå", gul: "gul", grøn: "grøn" };
    return colorMap[hint] ? colorMap[hint] : "";
  }

  function håndterSlet() { // punkt 4
    if (gættedeBogstaver.length > 0) {
      const sidsteBogstav = gættedeBogstaver.pop();
      const sidsteHint = hints.pop();

      const sidsteBogstavIndex = gættedeBogstaver.length + 1;
      const boxId = `ord-${aktuelRække}-${sidsteBogstavIndex}`;
      getAndUpdateBox(
        boxId,
        "",
        "filled-box",
        true,
        getBoxColorClass(sidsteHint)
      );

      if (sidsteHint === "grøn") {
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

      updateHintBoxes();
    }
  }

  function håndterGæt(bogstav) { // punkt 5
    const boxId = `ord-${aktuelRække}-${gættedeBogstaver.length + 1}`;
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const bogstavIndex = gættedeBogstaver.length;

    if (korrektOrd.includes(bogstav)) {
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

    if (gættedeBogstaver.length === 5) {
      console.log(
        "Gættet ord efter 5 bogstaver:",
        gættedeBogstaver.join("").toUpperCase()
      );
      tjekGæt();
    }

    updateHintBoxes();
  }

  function updateHintBoxes() { // punkt 6
    Array.from({ length: 3 }).forEach((_, i) => {
      const hintIndex = i;
      const hintClassName = hints[hintIndex]?.toLowerCase() || "";
      getAndUpdateBox(
        `hint-${i + 1}`,
        hints[hintIndex] || "",
        "hint-box",
        !hints[hintIndex],
        hintClassName
      );
    });
  }

  function tjekGæt() { // punkt 7
    const korrektOrd = valgteOrd[aktuelRække - 1].toUpperCase();
    const gættetOrd = gættedeBogstaver.join("").toUpperCase();

    console.log("Korrekt ord:", korrektOrd);
    console.log("Gættet ord:", gættetOrd);
    console.log("Er ordene ens:", korrektOrd === gættetOrd);

    if (gættetOrd === korrektOrd) {
      alert("Tillykke! Du gættede ordet!");
      aktuelRække++;

      if (aktuelRække > 5) {
        alert("Tillykke! Du har gennemført spillet!");
        aktuelRække = 1;
      } else {
        alert(`Du er nu på række ${aktuelRække}!`);
        updateHintBoxes();
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
    Array.from({ length: 5 }).forEach((_, i) => {
      getAndUpdateBox(`ord-${aktuelRække}-${i + 1}`, "", "filled-box", true);
    });

    Array.from({ length: 3 }).forEach((_, i) => {
      getAndUpdateBox(`hint-${i + 1}`, "", "hint-box", true);
    });
  }

  function tilføjTastaturEventListeners() { // punkt 8
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
