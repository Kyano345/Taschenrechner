const display = document.getElementById("display");
const zahlenknoepfe = document.querySelectorAll(".zahlenknöpfe");
const plusknopf = document.querySelector(".plus");
const minusknopf = document.querySelector(".minus");
const gleichknopf = document.querySelector(".resultatknopf");
const loeschknopf = document.querySelector(".löschknopf");
const resetknopf = document.querySelector(".resetknopf");
const malknopf = document.querySelector(".mal");
const geteiltknopf = document.querySelector(".durch");

let ersteZahl = null;
let operator = null;
let neueZahlStarten = false;

function Zwischenergebnis(zweiteZahl) {
  if (operator === "+") {
    ersteZahl = ersteZahl + zweiteZahl;
  } else if (operator === "-") {
    ersteZahl = ersteZahl - zweiteZahl;
  } else if (operator === "*") {
    ersteZahl = ersteZahl * zweiteZahl;
  } else if (operator === "/") {
    if (zweiteZahl === 0) {
      display.textContent = "Error";
      ersteZahl = null;
      operator = null;
      neueZahlStarten = true;
      return;
    } else {
      ersteZahl = ersteZahl / zweiteZahl;
    }
  }

  display.textContent = ersteZahl;
}

// Zahleneingabe
zahlenknoepfe.forEach(function (knopf) {
  knopf.addEventListener("click", function () {
    const zahl = knopf.textContent;

    if (neueZahlStarten === true) {
      display.textContent = zahl;
      neueZahlStarten = false;
    } else if (display.textContent === "0") {
      display.textContent = zahl;
    } else {
      display.textContent += zahl;
    }
  });
});

//löschen
loeschknopf.addEventListener("click", function () {
  let aktuellerWert = display.textContent;

  // Wenn nur eine Zahl vorhanden ist geht es zurück auf Null
  if (aktuellerWert.length === 1) {
    display.textContent = "0";
  } else {
    // Letzes Zeichen entfernen
    display.textContent = aktuellerWert.slice(0, -1);
  }
});

// Clear
resetknopf.addEventListener("click", function () {
  display.textContent = "0";
  ersteZahl = null;
  operator = null;
  neueZahlStarten = true;
});

// Addition
plusknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent);
  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  } else if (neueZahlStarten === false) {
    Zwischenergebnis(aktuelleZahl);
  }
  operator = "+";
  neueZahlStarten = true;
});

// Subtraktion
minusknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent);

  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  } else if (neueZahlStarten === false) {
    Zwischenergebnis(aktuelleZahl);
  }
  operator = "-";
  neueZahlStarten = true;
});

// Multiplikation
malknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent);

  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  } else if (neueZahlStarten === false) {
    Zwischenergebnis(aktuelleZahl);
  }

  operator = "*";
  neueZahlStarten = true;
});

// Division
geteiltknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent);

  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  } else if (neueZahlStarten === false) {
    Zwischenergebnis(aktuelleZahl);
  }

  operator = "/";
  neueZahlStarten = true;
});

// Gleich
gleichknopf.addEventListener("click", function () {
  if (operator === null || ersteZahl === null) {
    return;
  }

  const zweiteZahl = Number(display.textContent);
  Zwischenergebnis(zweiteZahl);

  operator = null;
  neueZahlStarten = true;
});

/*console.log("display:", display);
console.log("zahlenknoepfe:", zahlenknoepfe);
console.log("plusknopf", plusknopf);
console.log("minusknopf", minusknopf);
console.log("gleichknopf", gleichknopf);
console.log("loeschknopf", loeschknopf)
console.log("resetknopf", resetknopf);*/

/* const zweiteZahl = Number(display.textContent);

  if (operator === "+") {
    display.textContent = ersteZahl + zweiteZahl;

  } else if (operator === "-") {
    display.textContent = ersteZahl - zweiteZahl;
  } else if (operator === "*") {
    display.textContent = ersteZahl * zweiteZahl
  } else if (operator === "/") {
    display.textContent = ersteZahl / zweiteZahl
  }
  
  ersteZahl = null;
  operator = null;
  neueZahlStarten = true;
});*/
