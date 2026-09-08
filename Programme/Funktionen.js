// version vom 14.08.2026 !

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
let Zahlbereit = false; // true, sobald im Display eine fertige Zahl steht, die verrechnet werden darf
let Wartestapel = []; // zurückgestellte Rechnungen mit tieferem Rang (für Punkt vor Strich)

// Zahleneingabe
zahlenknoepfe.forEach(function (knopf) {
  knopf.addEventListener("click", function () {
    const zahl = knopf.textContent;

       if (neueZahlStarten === true) {
      display.textContent = zahl;
      neueZahlStarten = false;
    } else if (display.textContent === "0") {
      display.textContent = zahl;
        } else if (Number(display.textContent + zahl) <= Number.MAX_SAFE_INTEGER) {
      display.textContent += zahl; // nur anhängen, solange die Zahl exakt bleibt
    }
    Zahlbereit = true; // im Display steht jetzt eine verrechenbare Zahl
  });
});

//löschen
loeschknopf.addEventListener("click", function () {
  let aktuellerWert = display.textContent;

   // Letztes Zeichen entfernen
  const gekürzt = aktuellerWert.slice(0, -1);

  // Bleibt nichts Verwertbares übrig, zurück auf Null
  if (gekürzt === "" || gekürzt === "-") {
    display.textContent = "0";
  } else {
    display.textContent = gekürzt;
  }

  neueZahlStarten = false; // nach dem Löschen weitertippen statt neu anfangen
  Zahlbereit = true;
});

// Clear
resetknopf.addEventListener("click", function () {
  display.textContent = "0";
  ersteZahl = null;
  operator = null;
  Wartestapel = [];
  neueZahlStarten = true;
  Zahlbereit = false;
});

// Addition
plusknopf.addEventListener("click", function () {
  OperatorDruecken("+");
});

// Subtraktion
minusknopf.addEventListener("click", function () {
  OperatorDruecken("-");
});

// Multiplikation
malknopf.addEventListener("click", function () {
  OperatorDruecken("*");
});

// Division
geteiltknopf.addEventListener("click", function () {
  OperatorDruecken("/");
});


// Gleich
gleichknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return; // nach "Error" passiert nichts, bis RA oder eine neue Zahl kommt
  }
  if (operator === null || ersteZahl === null) {
    return;
  }
  Zusammenrechnen(Displaywert(), 0); // Rang 0 ist tiefer als alles, also wird alles Offene abgeschlossen
  ersteZahl = null; // Ergebnis bleibt nur im Display; die nächste Eingabe startet frisch
  operator = null;
  Wartestapel = [];
  neueZahlStarten = true;
  Zahlbereit = false;
});

//Wurzel
wurzelknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const Zahl = Displaywert();
  if (Zahl < 0) {
    Fehler();
    return;
  }
  Anzeigen(Math.sqrt(Zahl)); // verändert nur den Displaywert, offene Rechnungen bleiben liegen
  neueZahlStarten = true;
  Zahlbereit = true;
});

//Quadrat
quadratknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const Zahl = Displaywert();
  Anzeigen(Zahl * Zahl);
  neueZahlStarten = true;
  Zahlbereit = true;
});

//Potenz (test)..

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
      Fehler();
      return false; // meldet dem Aufrufer, dass nicht weitergerechnet werden darf
    }
    ersteZahl = ersteZahl / zweiteZahl;
  } else if (operator === "^") {
    ersteZahl = ersteZahl ** zweiteZahl;
  }
  Anzeigen(ersteZahl);
  return true;
}

//Potenzknopf
potenzknopf.addEventListener("click", function () {
  OperatorDruecken("^");
});



function Anzeigen(wert) {
  if (wert === Infinity || wert === -Infinity) {
    display.textContent = "To infinity and beyond";
  } else {
    display.textContent = wert;
  }
}



function Displaywert() {
  if (display.textContent === "To infinity and beyond") {
    return Infinity;
  }
  return Number(display.textContent);
}

// Gibt den Vorrang eines Rechenzeichens zurück: höherer Wert = wird zuerst gerechnet
function Rangordnung(zeichen) {
  if (zeichen === "+" || zeichen === "-") {
    return 1; // Strichrechnung
  }
  if (zeichen === "*" || zeichen === "/") {
    return 2; // Punktrechnung
  }
  return 3; // Potenz
}

// Wird von allen Rechenzeichen aufgerufen (+, -, x, ÷, x^y)
function OperatorDruecken(neuerOperator) {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const aktuelleZahl = Displaywert();
  if (ersteZahl === null) {
    ersteZahl = aktuelleZahl; // erste Zahl der Rechnung merken
  } else if (Zahlbereit === true) {
    Zusammenrechnen(aktuelleZahl, Rangordnung(neuerOperator));
    if (Fehlerangezeigt() === true) {
      return; // Division durch 0 hat den Rechner bereits zurückgesetzt
    }
  }
  operator = neuerOperator;
  neueZahlStarten = true;
  Zahlbereit = false;
}

// Entscheidet, ob sofort gerechnet oder die offene Rechnung zurückgestellt wird
function Zusammenrechnen(zweiteZahl, neuerRang) {
  if (Rangordnung(operator) < neuerRang) {
    // Das neue Zeichen bindet stärker, also die laufende Rechnung parken
    Wartestapel.push({ zahl: ersteZahl, operator: operator });
    ersteZahl = zweiteZahl;
    return;
  }
  if (Zwischenergebnis(zweiteZahl) === false) {
    return;
  }
  // Danach alle geparkten Rechnungen abarbeiten, die mindestens gleich stark binden
  while (
    Wartestapel.length > 0 &&
    Rangordnung(Wartestapel[Wartestapel.length - 1].operator) >= neuerRang
  ) {
    const eintrag = Wartestapel.pop(); // zuletzt geparkte Rechnung zurückholen
    const ergebnis = ersteZahl;
    ersteZahl = eintrag.zahl;
    operator = eintrag.operator;
    if (Zwischenergebnis(ergebnis) === false) {
      return;
    }
  }
}

// Prüft, ob im Display gerade eine Fehlermeldung steht
function Fehlerangezeigt() {
  return display.textContent === "Error";
}

// Setzt den Rechner nach einem unerlaubten Vorgang komplett zurück
function Fehler() {
  display.textContent = "Error";
  ersteZahl = null;
  operator = null;
  Wartestapel = [];
  neueZahlStarten = true;
  Zahlbereit = false;
}