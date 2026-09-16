// version vom 08.09.2026

const Display = document.getElementById("Display");
const Zahlenknoepfe = document.querySelectorAll(".Zahlenknöpfe");
const Plusknopf = document.querySelector(".plus");
const Minusknopf = document.querySelector(".minus");
const Gleichknopf = document.querySelector(".Resultatknopf");
const Loeschknopf = document.querySelector(".Löschknopf");
const Resetknopf = document.querySelector(".Resetknopf");
const Malknopf = document.querySelector(".mal");
const Geteiltknopf = document.querySelector(".durch");
const Wurzelknopf = document.querySelector(".Wurzelknopf");
const Quadratknopf = document.querySelector(".Quadratknopf");
const Potenzknopf = document.querySelector(".Potenzknopf");
const Kommaknopf = document.querySelector(".Kommaknopf");

let ersteZahl = null;
let operator = null;
let neueZahlStarten = false;
let Zahlbereit = false; // true, sobald im Display eine fertige Zahl steht, die verrechnet werden darf
let Wartestapel = []; // zurückgestellte Rechnungen mit tieferem Rang (für Punkt vor Strich)

// Zahleneingabe
Zahlenknoepfe.forEach(function (knopf) {
  knopf.addEventListener("click", function () {
    const zahl = knopf.textContent;

       if (neueZahlStarten === true) {
      Display.textContent = zahl;
      neueZahlStarten = false;
    } else if (Display.textContent === "0") {
      Display.textContent = zahl;
         } else if (
      Display.textContent.replace("-", "").replace(".", "").length < 16
    ) {
      Display.textContent += zahl; // max. 16 Ziffern, sonst rechnet JavaScript ungenau
    }
    Zahlbereit = true; // im Display steht jetzt eine verrechenbare Zahl
  });
});

// Komma
Kommaknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  if (neueZahlStarten === true) {
    Display.textContent = "0."; // neue Zahl beginnt mit "0."
    neueZahlStarten = false;
  } else if (Display.textContent.includes(".") === false) {
    Display.textContent += "."; // nur anhängen, wenn noch kein Punkt drin ist
  }
  Zahlbereit = true;
});

//löschen
Loeschknopf.addEventListener("click", function () {
  let aktuellerWert = Display.textContent;

   // Letztes Zeichen entfernen
  const gekürzt = aktuellerWert.slice(0, -1);

  // Bleibt nichts Verwertbares übrig, zurück auf Null
  if (gekürzt === "" || gekürzt === "-") {
    Display.textContent = "0";
  } else {
    Display.textContent = gekürzt;
  }

  neueZahlStarten = false; // nach dem Löschen weitertippen statt neu anfangen
  Zahlbereit = true;
});

// Clear
Resetknopf.addEventListener("click", function () {
  Display.textContent = "0";
  ersteZahl = null;
  operator = null;
  Wartestapel = [];
  neueZahlStarten = true;
  Zahlbereit = false;
});

// Addition
Plusknopf.addEventListener("click", function () {
  OperatorDruecken("+");
});

// Subtraktion
Minusknopf.addEventListener("click", function () {
  OperatorDruecken("-");
});

// Multiplikation
Malknopf.addEventListener("click", function () {
  OperatorDruecken("*");
});

// Division
Geteiltknopf.addEventListener("click", function () {
  OperatorDruecken("/");
});


// Gleich
Gleichknopf.addEventListener("click", function () {
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
Wurzelknopf.addEventListener("click", function () {
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
Quadratknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const Zahl = Displaywert();
  Anzeigen(Zahl * Zahl);
  neueZahlStarten = true;
  Zahlbereit = true;
});

// Zwischenergebnis
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
Potenzknopf.addEventListener("click", function () {
  OperatorDruecken("^");
});



function Anzeigen(wert) {
  if (wert === Infinity || wert === -Infinity) {
    Display.textContent = "To infinity and beyond";
    return;
  }
  if (String(wert).length > 16) {
    // toPrecision kürzt auf eine feste Anzahl gültiger Ziffern
    // Number() entfernt danach überflüssige Nullen am Ende
    Display.textContent = Number(wert.toPrecision(15));
  } else {
    Display.textContent = wert;
  }
}



function Displaywert() {
  if (Display.textContent === "To infinity and beyond") {
    return Infinity;
  }
  return Number(Display.textContent);
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
  return Display.textContent === "Error";
}

// Setzt den Rechner nach einem unerlaubten Vorgang komplett zurück
function Fehler() {
  Display.textContent = "Error";
  ersteZahl = null;
  operator = null;
  Wartestapel = [];
  neueZahlStarten = true;
  Zahlbereit = false;
}