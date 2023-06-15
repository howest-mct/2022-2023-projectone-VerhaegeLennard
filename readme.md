# Projectgegevens

**VOORNAAM NAAM:** Lennard Verhaege

**Sparringpartner:** Hanne Hellin

**Projectsamenvatting in max 10 woorden:**  Slim kippensysteem met monitoring, voedersysteem en automatisch luik

**Projecttitel:** EiQ

# Tips voor feedbackgesprekken

## Voorbereiding

> Bepaal voor jezelf waar je graag feedback op wil. Schrijf op voorhand een aantal punten op waar je zeker feedback over wil krijgen. Op die manier zal het feedbackgesprek gerichter verlopen en zullen vragen, die je zeker beantwoord wil hebben, aan bod komen.

## Tijdens het gesprek:

> **Luister actief:** Schiet niet onmiddellijk in de verdediging maar probeer goed te luisteren. Laat verbaal en non-verbaal ook zien dat je aandacht hebt voor de feedback door een open houding (oogcontact, rechte houding), door het maken van aantekeningen, knikken...

> **Maak notities:** Schrijf de feedback op zo heb je ze nog nadien. Noteer de kernwoorden en zoek naar een snelle noteer methode voor jezelf. Als je goed noteert,kan je op het einde van het gesprek je belangrijkste feedback punten kort overlopen.

> **Vat samen:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.

> **Sta open voor de feedback:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.`

> **Denk erover na:** Denk na over wat je met de feedback gaat doen en koppel terug. Vind je de opmerkingen terecht of onterecht? Herken je je in de feedback? Op welke manier ga je dit aanpakken?

## NA HET GESPREK

> Herlees je notities en maak actiepunten. Maak keuzes uit alle feedback die je kreeg: Waar kan je mee aan de slag en wat laat je even rusten. Wat waren de prioriteiten? Neem de opdrachtfiche er nog eens bij om je focuspunten te bepalen.Noteer je actiepunten op de feedbackfiche.

# Feedforward gesprekken

## Gesprek 1 (Datum: 24/05/2023)

Lector: Geert & Dieter

Vragen voor dit gesprek:

- vraag 1: Waarom werkt de klasse voor de lichtsensor niet naar behoren?

Dit is de feedback op mijn vragen.

- feedback 1: Reeds opgelost in code.

> Gesprekspunten:
	
	* Pd02 opdracht vergeten in te dienen -> wordt nog voor gekeken 		(herindienen 1e versie, deze was ok)
	* Weerstandje tussen knoppen en raspberry plaatsen als veiligheid.
	* Database OK

## Gesprek 2 (Datum: 25/05/2023)

Lector: Laprudence Christophe

Vragen voor dit gesprek:

-  vraag 1: Wat stuur ik via de socketio en de API door?
-  vraag 2: Hoeveel theats heb ik nodig?
-  vraag 3: Stuur ik alles eerst naar de database door en verwerk van daaruit de data?

Dit is de feedback op mijn vragen.

- feedback 1: Hangt af van wat je doorstuurt, socketio is beter voor kleinere dingen zoals mijn knoppen en 1 sensorwaarde. Als je history van een sensor nodig hebt doe je dit via de API omdat dit veel data is.
- feedback 2: Ik heb maar 1 threat nodig omdat ik binnen deze threats met vrschillende meetmomenten kan werken, door een if structuur. -> Dit zorgt er ook voor dat er geen probemen zijn bij gelijktijdig meten.
- feedback 3: Alles eerst naar de DB, dit is de single point of truth.

## Gesprek 3 (Datum: 30/05/2023)

Lector: Dieter & Stijn

Vragen voor dit gesprek:

- [x] vraag 1: /

Dit is de feedback op mijn vragen.

- feedback 1: Kom op tijd
- feedback 2: Klein tandje bijsteken

## Gesprek 4 (Datum: 06/06/2023)

Lector: Christophe & Frederik

Vragen voor dit gesprek:

- [x] vraag 1: /

Dit is de feedback op mijn vragen.

- feedback 1: Getallen afronden
- feedback 2: Benamingen op website versimpelere voor casual users
- feedback 3: Misschien een pagina maken om specifiekere historisch tonen?
- feedback 4: Zodat je niet alleen een grote tabel hebt
- feedback 5: Status van deur misschien toevoegen?
- feedback 6: Gebruiksvriendelijker?
- feedback 7: Commits specifieker maken
- feedback 8: Test metalen case
