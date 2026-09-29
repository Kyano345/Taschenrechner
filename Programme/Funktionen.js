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
const Feuerwerkknopf = document.getElementById("Feuerwerkknopf");
const Partyknopf = document.getElementById("Partyknopf");
const Umrechnerkopf = document.getElementById("Umrechnerkopf");
const Umrechnerliste = document.getElementById("Umrechnerliste");
const Umrechnerpfeil = document.getElementById("Umrechnerpfeil");
const Umrechnenknopf = document.getElementById("Umrechnenknopf");
const Einheiten = document.querySelectorAll(".Einheit");
const Luftschiffknopf = document.getElementById("Luftschiffknopf");
const Richtungsknöpfe = document.querySelectorAll(".Richtungsknopf");
const Münzzahl = document.getElementById("Münzzahl");
const Shopeinträge = document.querySelectorAll(".Shopeintrag");

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
  Lorentpalette: "#b79ced",
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

// Erzeugt eine einzelne Explosion an einer zufälligen Stelle der Seite
function Explosion() {
  const Mittex = Math.random() * window.innerWidth; // Math.random liefert eine Zufallszahl zwischen 0 und 1; innerWidth ist die Fensterbreite in Pixeln
  const Mittey = Math.random() * window.innerHeight;
  const Farbe = `hsl(${Math.random() * 360}, 100%, 60%)`; // hsl mischt eine Farbe aus Farbwinkel (0-360), Sättigung und Helligkeit

  for (let i = 0; i < 30; i++) {
    const Funke = document.createElement("div"); // createElement erzeugt ein neues Element, das noch nirgends auf der Seite steht
    Funke.className = "Funke"; // className setzt die Klasse des Elements
    Funke.style.left = Mittex + "px";
    Funke.style.top = Mittey + "px";
    Funke.style.backgroundColor = Farbe;

    const Winkel = (i / 30) * 2 * Math.PI; // verteilt die 30 Funken gleichmässig im Kreis; Math.PI ist die Kreiszahl
    const Weite = 80 + Math.random() * 120;
    Funke.style.setProperty("--Flugx", Math.cos(Winkel) * Weite + "px"); // Math.cos und Math.sin rechnen den Winkel in x- und y-Richtung um
    Funke.style.setProperty("--Flugy", Math.sin(Winkel) * Weite + "px");

    document.body.appendChild(Funke); // appendChild hängt das Element ans Ende des body an, damit es sichtbar wird

    // setTimeout führt etwas nach einer Wartezeit aus, hier nach 1000 Millisekunden
    setTimeout(function () {
      Funke.remove(); // remove löscht das Element wieder von der Seite
    }, 1000);
  }
}

// Feuerwerkknopf: löst mehrere Explosionen nacheinander aus
Feuerwerkknopf.addEventListener("click", function () {
  for (let i = 0; i < 8; i++) {
    setTimeout(Explosion, i * 250); // jede Explosion startet 250 Millisekunden nach der vorherigen
  }
});

let Partytaktgeber = null; // merkt sich den laufenden Takt, damit er wieder gestoppt werden kann

// Wählt ein zufälliges Element aus einer Liste
function Zufallseintrag(Liste) {
  return Liste[Math.floor(Math.random() * Liste.length)]; // Math.floor rundet ab, damit eine gültige Position in der Liste entsteht
}

// Setzt Farbschema und Neonfarbe auf je einen Zufallswert
function Partyschritt() {
  Farbschemasetzen(Zufallseintrag(Object.keys(Schemafarben))); // Object.keys liefert die Namen aller Einträge eines Objekts als Liste
  Neonfarbesetzen(Zufallseintrag(Object.keys(Neonfarben)));
}

// Partyknopf: startet und stoppt den Wechsel
Partyknopf.addEventListener("click", function () {
  if (Partytaktgeber === null) {
    Neonschalter.checked = true; // Neon einschalten, damit die Leuchtfarbe sichtbar ist
    Neonsetzen(true);
    Partyschritt(); // sofort einmal wechseln, statt eine halbe Sekunde zu warten
    Partytaktgeber = setInterval(Partyschritt, 500); // setInterval wiederholt etwas dauerhaft im angegebenen Abstand
    Partyknopf.classList.add("Aktiv");
  } else {
    clearInterval(Partytaktgeber); // clearInterval stoppt die Wiederholung
    Partytaktgeber = null;
    Partyknopf.classList.remove("Aktiv");
  }
});

// Jede Einheit als Vielfaches einer Grundeinheit: Länge in Metern, Gewicht in Gramm
const Einheitenwerte = {
  in: { Faktor: 0.0254, Art: "Länge" },
  cm: { Faktor: 0.01, Art: "Länge" },
  ft: { Faktor: 0.3048, Art: "Länge" },
  m: { Faktor: 1, Art: "Länge" },
  mi: { Faktor: 1609.344, Art: "Länge" },
  km: { Faktor: 1000, Art: "Länge" },
  oz: { Faktor: 28.349523125, Art: "Gewicht" },
  g: { Faktor: 1, Art: "Gewicht" },
  lb: { Faktor: 453.59237, Art: "Gewicht" },
  kg: { Faktor: 1000, Art: "Gewicht" },
};

let Voneinheit = null; // Einheit, aus der umgerechnet wird
let Warteaufzieleinheit = false; // true, sobald der Pfeilknopf gedrückt wurde

// Umrechnerkopf: öffnet und schliesst die Liste
Umrechnerkopf.addEventListener("click", function () {
  Umrechnerliste.classList.toggle("Offen");

  if (Umrechnerliste.classList.contains("Offen")) {
    Umrechnerpfeil.textContent = "▾";
  } else {
    Umrechnerpfeil.textContent = "▸";
  }
});

// Umrechnenknopf: merkt sich, dass als Nächstes die Zieleinheit kommt
Umrechnenknopf.addEventListener("click", function () {
  if (Voneinheit !== null) {
    Warteaufzieleinheit = true;
  }
});

// Einheiten: erster Klick wählt die Ausgangseinheit, nach dem Pfeil die Zieleinheit
Einheiten.forEach(function (Knopf) {
  Knopf.addEventListener("click", function () {
    const Kürzel = Knopf.dataset.einheit;

    if (Warteaufzieleinheit === true) {
      Umrechnen(Kürzel);
      return;
    }

    Voneinheit = Kürzel;
    Einheiten.forEach(function (Anderer) {
      Anderer.classList.remove("Gewählt");
    });
    Knopf.classList.add("Gewählt");
    Display.textContent = "0";
    NeueZahlStarten = false;
  });
});

// Rechnet den Displaywert von Voneinheit in die Zieleinheit um
function Umrechnen(Zieleinheit) {
  const Von = Einheitenwerte[Voneinheit];
  const Ziel = Einheitenwerte[Zieleinheit];

  if (Von.Art !== Ziel.Art) {
    Display.textContent = "Error"; // Länge lässt sich nicht in Gewicht umrechnen
  } else {
    const Wert = Number(Display.textContent.split(" ")[0]); // split zerlegt den Text an den Leerzeichen, [0] ist das erste Stück
    const Ergebnis = (Wert * Von.Faktor) / Ziel.Faktor;
    Display.textContent =
      Wert +
      " " +
      Voneinheit +
      " / " +
      Number(Ergebnis.toPrecision(10)) +
      " " +
      Zieleinheit;
  }

  Warteaufzieleinheit = false;
  Voneinheit = null;
  Einheiten.forEach(function (Knopf) {
    Knopf.classList.remove("Gewählt");
  });
  NeueZahlStarten = true;
  Zahlbereit = false;
}

// Seltenheiten mit ihrer Wahrscheinlichkeit in Prozent
const Luftschifffarben = [
  { Farbe: "#2ecc40", Anteil: 53.125 }, // Grün
  { Farbe: "#0074d9", Anteil: 25 }, // Blau
  { Farbe: "#b10dc9", Anteil: 12.5 }, // Violett
  { Farbe: "#ff4136", Anteil: 6.25 }, // Rot
  { Farbe: "#ffd700", Anteil: 3.125 }, // Gelbgold
];

let Flugrichtung = "zufall";

// Würfelt eine Farbe nach den Anteilen aus
function Luftschifffarbewählen() {
  const Wurf = Math.random() * 100;
  let Grenze = 0;

  for (let i = 0; i < Luftschifffarben.length; i++) {
    Grenze = Grenze + Luftschifffarben[i].Anteil; // Anteile aufsummieren, bis der Wurf darunter liegt
    if (Wurf < Grenze) {
      return Luftschifffarben[i].Farbe;
    }
  }
  return Luftschifffarben[0].Farbe;
}

// Richtungsknöpfe: Klick wählt die Flugrichtung
Richtungsknöpfe.forEach(function (Knopf) {
  Knopf.addEventListener("click", function () {
    Flugrichtung = Knopf.dataset.richtung;
    Richtungsknöpfe.forEach(function (Anderer) {
      Anderer.classList.remove("Aktiv");
    });
    Knopf.classList.add("Aktiv");
  });
});

// Luftschiffknopf: lässt ein Luftschiff über den Bildschirm fliegen
Luftschiffknopf.addEventListener("click", function () {
  const Schiff = document.createElement("div");
  Schiff.className = "Luftschiff";
  const Farbe = Luftschifffarbewählen();
  // innerHTML setzt HTML-Inhalt ins Element, hier die drei Teile des Luftschiffs
  Schiff.innerHTML =
    '<div class="Hülle"></div><div class="Gondel"></div><div class="Heckflosse"></div>';
  Schiff.style.setProperty("--Schifffarbe", Farbe);
  if (Farbe === "#ffd700") {
    Schiff.style.pointerEvents = "auto"; // nur das goldene Schiff ist anklickbar
    Schiff.style.cursor = "pointer";
    Schiff.addEventListener("click", function () {
      Münzedazu();
      Schiff.remove();
    });
  }
  Schiff.style.top = 10 + Math.random() * 60 + "%"; // zufällige Höhe auf dem Bildschirm

  let Richtung = Flugrichtung;
  if (Richtung === "zufall") {
    if (Math.random() < 0.5) {
      Richtung = "links";
    } else {
      Richtung = "rechts";
    }
  }

  if (Richtung === "rechts") {
    Schiff.style.animation = "Flugrechts 5s linear forwards"; // linear = gleichbleibende Geschwindigkeit
  } else {
    Schiff.style.animation = "Fluglinks 5s linear forwards";
  }

  document.body.appendChild(Schiff);

  setTimeout(function () {
    Schiff.remove();
  }, 5000);
});

// Beim Laden den gespeicherten Münzstand holen
let Münzen = Number(localStorage.getItem("Münzen")) || 0; // || 0 setzt 0 ein, wenn noch nichts gespeichert ist
Münzzahl.textContent = Münzen;

// Zählt eine Münze dazu und merkt sich den Stand
function Münzedazu() {
  Münzen = Münzen + 1;
  Münzzahl.textContent = Münzen;
  localStorage.setItem("Münzen", Münzen);
}

// Liste der gekauften Animationen aus dem Speicher holen
let Gekaufteanimationen = JSON.parse(localStorage.getItem("Animationen")) || []; // JSON.parse wandelt gespeicherten Text zurück in eine Liste

// Markiert gekaufte Einträge im Shop
function Shopaktualisieren() {
  Shopeinträge.forEach(function (Eintrag) {
    if (Gekaufteanimationen.includes(Eintrag.dataset.animation)) {
      Eintrag.classList.add("Gekauft");
      Eintrag.textContent = Eintrag.dataset.animation + " – abspielen";
    }
  });
}
Shopaktualisieren();

// Shopeinträge: erster Klick kauft, danach spielt jeder Klick die Animation ab
Shopeinträge.forEach(function (Eintrag) {
  Eintrag.addEventListener("click", function () {
    const Name = Eintrag.dataset.animation;
    const Preis = Number(Eintrag.dataset.preis);

    if (Gekaufteanimationen.includes(Name)) {
      Animationabspielen(Name);
      return;
    }

    if (Münzen < Preis) {
      return; // zu wenig Münzen, nichts passiert
    }

    Münzen = Münzen - Preis;
    Münzzahl.textContent = Münzen;
    localStorage.setItem("Münzen", Münzen);

    Gekaufteanimationen.push(Name);
    localStorage.setItem("Animationen", JSON.stringify(Gekaufteanimationen)); // JSON.stringify wandelt die Liste in Text, weil localStorage nur Text speichert
    Shopaktualisieren();
    Animationabspielen(Name);
  });
});

// Spielt die gekaufte Animation ab
function Animationabspielen(Name) {
  if (Name === "Konfetti") {
    Konfettiregen();
  } else if (Name === "Sterne") {
    Sternenhimmel();
  } else if (Name === "Laser") {
    Laserstrahlen();
  } else if (Name === "Goldregen") {
    Goldregen();
  }
}

// Erzeugt ein einzelnes fliegendes Teilchen
function Teilchen(Klasse, Inhalt, Startx, Starty, Dauer) {
  const Stück = document.createElement("div");
  Stück.className = Klasse;
  Stück.textContent = Inhalt;
  Stück.style.left = Startx + "px";
  Stück.style.top = Starty + "px";
  document.body.appendChild(Stück);

  setTimeout(function () {
    Stück.remove();
  }, Dauer);
  return Stück;
}

// Konfetti: bunte Rechtecke fallen von oben
function Konfettiregen() {
  for (let i = 0; i < 80; i++) {
    setTimeout(function () {
      const Stück = Teilchen(
        "Konfetti",
        "",
        Math.random() * window.innerWidth,
        -20,
        4000,
      );
      Stück.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
      Stück.style.setProperty("--Drehung", Math.random() * 1080 + "deg"); // deg steht für Grad, die Einheit für Drehwinkel
      Stück.style.animationDuration = 2 + Math.random() * 2 + "s";
    }, i * 40);
  }
}

// Sterne: funkelnde Punkte erscheinen überall
function Sternenhimmel() {
  for (let i = 0; i < 60; i++) {
    setTimeout(function () {
      Teilchen(
        "Stern",
        "✦",
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        2000,
      );
    }, i * 50);
  }
}

// Laser: farbige Strahlen schiessen quer über den Bildschirm
function Laserstrahlen() {
  for (let i = 0; i < 20; i++) {
    setTimeout(function () {
      const Strahl = Teilchen(
        "Laser",
        "",
        0,
        Math.random() * window.innerHeight,
        1500,
      );
      Strahl.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 55%)`;
      Strahl.style.boxShadow = "0 0 20px " + Strahl.style.backgroundColor;
    }, i * 120);
  }
}

// Goldregen: Münzen regnen herunter
function Goldregen() {
  for (let i = 0; i < 60; i++) {
    setTimeout(function () {
      const Stück = Teilchen(
        "Goldstück",
        "",
        Math.random() * window.innerWidth,
        -30,
        4000,
      );
      Stück.style.animationDuration = 2 + Math.random() * 1.5 + "s";
    }, i * 60);
  }
}
