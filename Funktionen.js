// version vom 14.08.2026

const display = document.getElementById("display");
const zahlenknoepfe = document.querySelectorAll(".zahlenknöpfe");
const plusknopf = document.querySelector(".plus");
const minusknopf = document.querySelector(".minus");
const gleichknopf = document.querySelector(".resultatknopf");
const loeschknopf = document.querySelector(".löschknopf");
const resetknopf = document.querySelector(".resetknopf");
const malknopf = document.querySelector(".mal");
const geteiltknopf = document.querySelector(".durch");
const wurzelknopf = document.querySelector(".wurzelknopf");
const quadratknopf = document.querySelector(".quadratknopf");
const potenzknopf = document.querySelector(".potenzknopf");

let ersteZahl = null;
let operator = null;
let neueZahlStarten = false;
let Zahlvorpotenz = null;
let Operatorvorpotenz = null;

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
  Zahlvorpotenz = null;
  Operatorvorpotenz = null;
  neueZahlStarten = true;
});

// Addition
plusknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent);
  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  } else if (neueZahlStarten === false) {
    if (operator === "^") {
      potenzAbschliessen(aktuelleZahl);
    } else {
      Zwischenergebnis(aktuelleZahl);
    }
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
    if (operator === "^") {
      potenzAbschliessen(aktuelleZahl);
    } else {
      Zwischenergebnis(aktuelleZahl);
    }
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
    if (operator === "^") {
      potenzAbschliessen(aktuelleZahl);
    } else {
      Zwischenergebnis(aktuelleZahl);
    }
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
    if (operator === "^") {
      potenzAbschliessen(aktuelleZahl);
    } else {
      Zwischenergebnis(aktuelleZahl);
    }
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
  if (operator === "^") {
    potenzAbschliessen(zweiteZahl);
  } else {
    Zwischenergebnis(zweiteZahl);
  }
  operator = null;
  neueZahlStarten = true;
});

//Wurzel
wurzelknopf.addEventListener("click", function () {
  const Zahl = Number(display.textContent);

  if (Zahl < 0) {
    display.textContent = "Error";
    ersteZahl = null;
    operator = null;
    neueZahlStarten = true;
    return;
  }
  let ergebnis = Math.sqrt(Zahl);
  display.textContent = ergebnis;
  if (operator !== null && ersteZahl !== null) {
    Zwischenergebnis(ergebnis);
  }
  neueZahlStarten = true;
});

//Quadrat
quadratknopf.addEventListener("click", function () {
  const Zahl = Number(display.textContent);
  let ergebnis = Zahl * Zahl;
  display.textContent = ergebnis;
  //für Kettenrechnungen
  if (operator !== null && ersteZahl !== null) {
    Zwischenergebnis(ergebnis);
  }
  neueZahlStarten = true;
});

//Potenz

//Funktion
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
  } else if (operator === "^") {
    ersteZahl = ersteZahl ** zweiteZahl;
  }
  display.textContent = ersteZahl;
}
/*
  Von hier anschauen
*/
//Knopf
potenzknopf.addEventListener("click", function () {
  const aktuelleZahl = Number(display.textContent); //Displaywert in Zahl umwandeln
  if (
    operator !== null && // Wenn bereits ein Operator vorhanden ist, außer Potenz, und eine Zahl eingegeben wurde, wird das Zwischenergebnis berechnet
    operator !== "^" && // Wenn der aktuelle Operator nicht Potenz ist, wird das Zwischenergebnis berechnet
    ersteZahl !== null && // Wenn bereits eine erste Zahl vorhanden ist, wird das Zwischenergebnis berechnet
    neueZahlStarten === false
  ) {
    Zahlvorpotenz = ersteZahl;
    Operatorvorpotenz = operator;

    ersteZahl = aktuelleZahl;
  } else if (ersteZahl === null) {
    ersteZahl = aktuelleZahl;
  }
  operator = "^";
  neueZahlStarten = true;
});

// Zusatzfunktion für korrekte Reihenfolge beim Potenzrechnen
function potenzAbschliessen(exponent) {
  Zwischenergebnis(exponent);
  if (Operatorvorpotenz !== null) {
    const potenzErgebnis = ersteZahl;
    ersteZahl = Zahlvorpotenz;
    operator = Operatorvorpotenz;
    Zahlvorpotenz = null;
    Operatorvorpotenz = null;
    Zwischenergebnis(potenzErgebnis);
  }
}
