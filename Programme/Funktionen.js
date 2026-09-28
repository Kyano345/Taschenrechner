const Display = document.getElementById("Display");
const Zahlenknöpfe = document.querySelectorAll(".Zahlenknöpfe");
const Plusknopf = document.querySelector(".plus");
const Minusknopf = document.querySelector(".minus");
const Gleichknopf = document.querySelector(".Resultatknopf");
const Löschknopf = document.querySelector(".Löschknopf");
const Resetknopf = document.querySelector(".Resetknopf");
const Malknopf = document.querySelector(".mal");
const Geteiltknopf = document.querySelector(".durch");
const Wurzelknopf = document.querySelector(".Wurzelknopf");
const Quadratknopf = document.querySelector(".Quadratknopf");
const Potenzknopf = document.querySelector(".Potenzknopf");
const Kommaknopf = document.querySelector(".Kommaknopf");
const Farbauswahlkopf = document.getElementById("Farbauswahlkopf");
const Farbauswahlliste = document.getElementById("Farbauswahlliste");
const Kopffarbkästchen = document.getElementById("Kopffarbkästchen");
const Pfeil = document.getElementById("Pfeil");
const Farboptionen = document.querySelectorAll(".Farboption");
const Neonschalter = document.getElementById("Neonschalter");
const Neonauswahlkopf = document.getElementById("Neonauswahlkopf");
const Neonauswahlliste = document.getElementById("Neonauswahlliste");
const Neonkopffarbkästchen = document.getElementById("Neonkopffarbkästchen");
const Neonpfeil = document.getElementById("Neonpfeil");
const Neonoptionen = document.querySelectorAll(".Neonoption");

let ErsteZahl = null;
let Operator = null;
let NeueZahlStarten = false;
let Zahlbereit = false; // true, sobald im Display eine fertige Zahl steht, die verrechnet werden darf
let Wartestapel = []; // zurückgestellte Rechnungen mit tieferem Rang (für Punkt vor Strich)

// Zahleneingabe
Zahlenknöpfe.forEach(function (Knopf) {
  Knopf.addEventListener("click", function () {
    const Zahl = Knopf.textContent;

    if (NeueZahlStarten === true) {
      Display.textContent = Zahl;
      NeueZahlStarten = false;
    } else if (Display.textContent === "0") {
      Display.textContent = Zahl;
    } else if (
      Display.textContent.replace("-", "").replace(".", "").length < 16
    ) {
      Display.textContent += Zahl; // max. 16 Ziffern, sonst rechnet JavaScript ungenau
    }
    Zahlbereit = true; // im Display steht jetzt eine verrechenbare Zahl
  });
});

// Kommaknopf
Kommaknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  if (NeueZahlStarten === true) {
    Display.textContent = "0."; // neue Zahl beginnt mit "0."
    NeueZahlStarten = false;
  } else if (Display.textContent.includes(".") === false) {
    Display.textContent += "."; // nur anhängen, wenn noch kein Punkt drin ist
  }
  Zahlbereit = true;
});

// Löschknopf
Löschknopf.addEventListener("click", function () {
  const AktuellerWert = Display.textContent;

  // Letztes Zeichen entfernen
  const gekürzt = AktuellerWert.slice(0, -1);

  // Bleibt nichts Verwertbares übrig, zurück auf Null
  if (gekürzt === "" || gekürzt === "-") {
    Display.textContent = "0";
  } else {
    Display.textContent = gekürzt;
  }

  NeueZahlStarten = false; // nach dem Löschen weitertippen statt neu anfangen
  Zahlbereit = true;
});

// Resetknopf
Resetknopf.addEventListener("click", function () {
  Display.textContent = "0";
  ErsteZahl = null;
  Operator = null;
  Wartestapel = [];
  NeueZahlStarten = true;
  Zahlbereit = false;
});

// Additionsknopf
Plusknopf.addEventListener("click", function () {
  OperatorDruecken("+");
});

// Subtraktionsknopf
Minusknopf.addEventListener("click", function () {
  OperatorDruecken("-");
});

// Multiplikationsknopf
Malknopf.addEventListener("click", function () {
  OperatorDruecken("*");
});

// Divisionsknopf
Geteiltknopf.addEventListener("click", function () {
  OperatorDruecken("/");
});

// Gleichknopf
Gleichknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return; // nach "Error" passiert nichts, bis RA oder eine neue Zahl kommt
  }
  if (Operator === null || ErsteZahl === null) {
    return;
  }
  Zusammenrechnen(Displaywert(), 0); // Rang 0 ist tiefer als alles, also wird alles Offene abgeschlossen
  ErsteZahl = null; // Ergebnis bleibt nur im Display; die nächste Eingabe startet frisch
  Operator = null;
  Wartestapel = [];
  NeueZahlStarten = true;
  Zahlbereit = false;
});

// Wurzelknopf
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
  NeueZahlStarten = true;
  Zahlbereit = true;
});

// Quadratknopf
Quadratknopf.addEventListener("click", function () {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const Zahl = Displaywert();
  Anzeigen(Zahl * Zahl);
  NeueZahlStarten = true;
  Zahlbereit = true;
});

// Potenzknopf
Potenzknopf.addEventListener("click", function () {
  OperatorDruecken("^");
});

// Rechnet ErsteZahl und ZweiteZahl mit dem aktuellen Operator zusammen; gibt false zurück, wenn durch 0 geteilt wurde
function Zwischenergebnis(ZweiteZahl) {
  if (Operator === "+") {
    ErsteZahl = ErsteZahl + ZweiteZahl;
  } else if (Operator === "-") {
    ErsteZahl = ErsteZahl - ZweiteZahl;
  } else if (Operator === "*") {
    ErsteZahl = ErsteZahl * ZweiteZahl;
  } else if (Operator === "/") {
    if (ZweiteZahl === 0) {
      Fehler();
      return false; // meldet dem Aufrufer, dass nicht weitergerechnet werden darf
    }
    ErsteZahl = ErsteZahl / ZweiteZahl;
  } else if (Operator === "^") {
    ErsteZahl = ErsteZahl ** ZweiteZahl;
  }
  Anzeigen(ErsteZahl);
  return true;
}

// Schreibt einen Wert ins Display; Unendlich wird als Text ausgegeben, zu lange Kommazahlen werden gerundet
function Anzeigen(Wert) {
  if (Wert === Infinity || Wert === -Infinity) {
    Display.textContent = "To infinity and beyond";
    return;
  }
  if (String(Wert).length > 16) {
    // toPrecision kürzt auf eine feste Anzahl gültiger Ziffern
    // Number() entfernt danach überflüssige Nullen am Ende
    Display.textContent = Number(Wert.toPrecision(15));
  } else {
    Display.textContent = Wert;
  }
}

// Liest das Display als Zahl aus; der Unendlich-Text wird dabei wieder zur Zahl Infinity
function Displaywert() {
  if (Display.textContent === "To infinity and beyond") {
    return Infinity;
  }
  return Number(Display.textContent);
}

// Gibt den Vorrang eines Rechenzeichens zurück: höherer Wert = wird zuerst gerechnet
function Rangordnung(Zeichen) {
  if (Zeichen === "+" || Zeichen === "-") {
    return 1; // Strichrechnung
  }
  if (Zeichen === "*" || Zeichen === "/") {
    return 2; // Punktrechnung
  }
  return 3; // Potenz
}

// Wird von allen Rechenzeichen aufgerufen (+, -, x, ÷, x^y)
function OperatorDruecken(NeuerOperator) {
  if (Fehlerangezeigt() === true) {
    return;
  }
  const AktuelleZahl = Displaywert();
  if (ErsteZahl === null) {
    ErsteZahl = AktuelleZahl; // erste Zahl der Rechnung merken
  } else if (Zahlbereit === true) {
    Zusammenrechnen(AktuelleZahl, Rangordnung(NeuerOperator));
    if (Fehlerangezeigt() === true) {
      return; // Division durch 0 hat den Rechner bereits zurückgesetzt
    }
  }
  Operator = NeuerOperator;
  NeueZahlStarten = true;
  Zahlbereit = false;
}

// Entscheidet, ob sofort gerechnet oder die offene Rechnung zurückgestellt wird
function Zusammenrechnen(ZweiteZahl, NeuerRang) {
  if (Rangordnung(Operator) < NeuerRang) {
    // Das neue Zeichen bindet stärker, also die laufende Rechnung parken
    Wartestapel.push({ Zahl: ErsteZahl, Operator: Operator });
    ErsteZahl = ZweiteZahl;
    return;
  }
  if (Zwischenergebnis(ZweiteZahl) === false) {
    return;
  }
  // Danach alle geparkten Rechnungen abarbeiten, die mindestens gleich stark binden
  while (
    Wartestapel.length > 0 &&
    Rangordnung(Wartestapel[Wartestapel.length - 1].Operator) >= NeuerRang
  ) {
    const Eintrag = Wartestapel.pop(); // zuletzt geparkte Rechnung zurückholen
    const Ergebnis = ErsteZahl;
    ErsteZahl = Eintrag.Zahl;
    Operator = Eintrag.Operator;
    if (Zwischenergebnis(Ergebnis) === false) {
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
  ErsteZahl = null;
  Operator = null;
  Wartestapel = [];
  NeueZahlStarten = true;
  Zahlbereit = false;
}

// Hauptfarbe jedes Schemas für die Farbkästchen
const Schemafarben = {
  Standard: "aqua",
  Krautgarten: "#f2f79e",
  Herbstlaub: "#e2f9b8",
  Lorentpalette: "#efd9ce",
};

// Setzt das Farbschema, aktualisiert Kästchen und Markierung und merkt sich die Wahl
function Farbschemasetzen(Schema) {
  document.body.dataset.farbschema = Schema; // dataset schreibt das Attribut data-farbschema ins HTML
  localStorage.setItem("Farbschema", Schema); // localStorage speichert Text dauerhaft im Browser, auch nach dem Schliessen
  Kopffarbkästchen.style.backgroundColor = Schemafarben[Schema]; // style.backgroundColor setzt die Farbe direkt am Element

  Farboptionen.forEach(function (Option) {
    if (Option.dataset.schema === Schema) {
      Option.classList.add("Aktiv"); // classList.add fügt die Klasse hinzu
    } else {
      Option.classList.remove("Aktiv");
    }
  });
}

// Farboptionen: Klick wählt das Schema aus
Farboptionen.forEach(function (Option) {
  const Schema = Option.dataset.schema;
  Option.querySelector(".Farbkästchen").style.backgroundColor =
    Schemafarben[Schema];

  Option.addEventListener("click", function () {
    Farbschemasetzen(Schema);
  });
});

// Beim Laden der Seite die zuletzt gewählte Farbe wiederherstellen, sonst Standard
const GespeichertesSchema = localStorage.getItem("Farbschema"); // getItem liest den gespeicherten Wert; null, wenn noch nie gespeichert wurde
if (GespeichertesSchema !== null) {
  Farbschemasetzen(GespeichertesSchema);
} else {
  Farbschemasetzen("Standard");
}

// Farbauswahlkopf: öffnet und schliesst die Liste
Farbauswahlkopf.addEventListener("click", function () {
  Farbauswahlliste.classList.toggle("Offen"); // classList.toggle fügt die Klasse hinzu, wenn sie fehlt, und entfernt sie, wenn sie da ist

  if (Farbauswahlliste.classList.contains("Offen")) {
    // classList.contains prüft, ob die Klasse gesetzt ist
    Pfeil.textContent = "▾";
  } else {
    Pfeil.textContent = "▸";
  }
});

// Schaltet Neon auf dem body-Element ein oder aus und merkt sich die Stellung
function Neonsetzen(Eingeschaltet) {
  document.body.dataset.neon = Eingeschaltet;
  localStorage.setItem("Neon", Eingeschaltet);
}

// Neonschalter
Neonschalter.addEventListener("change", function () {
  // "change" löst aus, sobald der Schalter umgelegt wird
  Neonsetzen(Neonschalter.checked); // checked ist true, wenn die Checkbox angekreuzt ist
});

// Beim Laden der Seite die zuletzt gewählte Stellung wiederherstellen
const GespeichertesNeon = localStorage.getItem("Neon");
if (GespeichertesNeon === "true") {
  // localStorage speichert nur Text, deshalb Vergleich mit "true" statt true
  Neonschalter.checked = true;
  Neonsetzen(true);
} else {
  Neonsetzen(false);
}

// Leuchtfarben zur Auswahl
const Neonfarben = {
  Grün: "#39ff14",
  Hellblau: "#00e5ff",
  Dunkelblau: "#1b3bff",
  Orange: "#ff8c00",
  Rot: "#ff1744",
};

// Setzt die Leuchtfarbe, aktualisiert Kästchen und Markierung und merkt sich die Wahl
function Neonfarbesetzen(Farbe) {
  document.body.style.setProperty("--Neonfarbe", Neonfarben[Farbe]); // setProperty schreibt eine CSS-Variable direkt aufs Element
  localStorage.setItem("Neonfarbe", Farbe);
  Neonkopffarbkästchen.style.backgroundColor = Neonfarben[Farbe];

  Neonoptionen.forEach(function (Option) {
    if (Option.dataset.neonfarbe === Farbe) {
      Option.classList.add("Aktiv");
    } else {
      Option.classList.remove("Aktiv");
    }
  });
}

// Neonauswahlkopf: öffnet und schliesst die Liste
Neonauswahlkopf.addEventListener("click", function () {
  Neonauswahlliste.classList.toggle("Offen");

  if (Neonauswahlliste.classList.contains("Offen")) {
    Neonpfeil.textContent = "▾";
  } else {
    Neonpfeil.textContent = "▸";
  }
});

// Neonoptionen: Klick wählt die Leuchtfarbe aus
Neonoptionen.forEach(function (Option) {
  const Farbe = Option.dataset.neonfarbe;
  Option.querySelector(".Farbkästchen").style.backgroundColor =
    Neonfarben[Farbe];

  Option.addEventListener("click", function () {
    Neonfarbesetzen(Farbe);
  });
});

// Beim Laden der Seite die zuletzt gewählte Leuchtfarbe wiederherstellen, sonst Grün
const GespeicherteNeonfarbe = localStorage.getItem("Neonfarbe");
if (GespeicherteNeonfarbe !== null) {
  Neonfarbesetzen(GespeicherteNeonfarbe);
} else {
  Neonfarbesetzen("Grün");
}
