# Claude-instruktioner for Svaneeng-Hjemmeside

Dette repo indeholder Svaneeng A/S' hjemmeside.

Repo:
https://github.com/TimSvaneeng/Svaneeng-Hjemmeside

Live preview:
https://timsvaneeng.github.io/Svaneeng-Hjemmeside/

## Vigtige regler

Svaneeng A/S leverer ikke totalentrepriser.

Følgende ord må ikke fremgå nogen steder på hjemmesiden:

* totalentreprise
* totalentrepriser
* totalentreprenør
* nøglefærdig
* nøglefærdige

Brug i stedet:

* hovedentreprise
* tømrerentreprise
* fagentreprise
* renoveringsopgave
* samlet renoveringsopgave
* koordinering af fag og underentreprenører

Svaneeng udfører også mindre service- og vedligeholdsopgaver, men hjemmesiden må ikke fremstå som en privat handyman-side.

Service skal beskrives som erhvervsrettet service for:

* ejendomme
* administratorer
* erhvervskunder
* faste samarbejdspartnere

Hjemmesiden må ikke love, antyde eller tilbyde at dele kontaktoplysninger til tidligere bygherrer, kunder eller samarbejdspartnere.

Referencer må gerne beskrives med projektbeskrivelser, billeder, entrepriseform, kundegruppe og relevante erfaringer – men uden at love direkte kontakt til tidligere kunder/bygherrer.

## Tone of voice

Skriv som Svaneeng/Tim:

* professionelt
* konkret
* ordentligt
* menneskeligt
* uden oppustet reklamesprog

Undgå generiske AI-formuleringer som:

* "vi brænder for kvalitet"
* "skræddersyede løsninger"
* "din foretrukne partner"
* "vi går den ekstra mil"

Skriv hellere konkret om:

* planlægning
* koordinering
* kvalitetssikring
* dokumentation
* beboerhensyn
* AB 18
* ansvar
* tydelige rammer
* faglig udførelse

## Teknisk struktur

* index.html = HTML-struktur, sektioner, formularer og SEO/meta
* assets/css/styles.css = styling og responsive regler
* assets/js/main.js = navigation, mobile menu, scroll, GDPR-modal og kontaktformular-placeholder
* assets/js/jobs.js = jobopslag, jobmodal, ansøgningslogik, CV-krav og CV-filvalidering
* assets/data/jobs.json = ledige stillinger og active true/false
* assets/images/ = hero-billede, referencebilleder og OG-billede
* assets/logo/ = Svaneeng-logoer
* assets/favicon/ = favicon og apple-touch-icon

## Vigtige filnavne

Disse filnavne bruges i koden og må ikke ændres uden også at ændre referencer i HTML/CSS/JS:

* assets/images/hero-projekt.jpg
* assets/images/reference-01.jpg
* assets/images/reference-02.jpg
* assets/images/reference-03.jpg
* assets/images/og-image.jpg
* assets/logo/svaneeng-logo.png
* assets/logo/svaneeng-logo-white.png
* assets/data/jobs.json

GitHub Pages skelner mellem store og små bogstaver. Reference-01.jpg og reference-01.jpg er ikke det samme.

## Jobopslag

Ledige stillinger styres i:

assets/data/jobs.json

Kun opslag med:

"active": true

vises på hjemmesiden.

CV skal være påkrævet ved:

* Byggeleder
* Projektleder
* Administrativ medarbejder

CV skal være valgfrit ved:

* Faglært tømrersvend
* Tømrersvend – Entreprise
* Tømrersvend – Service/spjæld
* Tømrerlærling
* Pladsmand
* Praktikant
* Uopfordret ansøgning
* Andet

## Formularer

Formularerne sender ikke rigtigt endnu.

Kontaktformular og ansøgningsformular bruger stadig placeholder-submit.

Backend skal senere kunne:

* modtage kontaktformular
* modtage ansøgning
* håndtere CV-upload
* sende intern mail til [info@svaneeng.dk](mailto:info@svaneeng.dk)
* sende kvitteringsmail til ansøger
* håndtere fejl korrekt

Hidden fields i HTML må ikke bruges som sikker kilde til routing. Modtageradresse og emneskabelon skal ligge server-side.

## Arbejdsmåde

Lav kun ændringer, der er nødvendige for den konkrete opgave.

Ved små opgaver:

* Ret kun relevante filer
* Lav ikke redesign
* Lav ikke nye sektioner uden eksplicit besked
* Omskriv ikke hele siden uden grund

Ved større opgaver:

1. Sig hvilke filer du vil ændre
2. Forklar kort planen
3. Lav ændringen

Efter hver opgave skal du afslutte med:

HANDOVER TIL CHATGPT:

* Ændret:
* Filer ændret:
* Tekster der bør kvalitetssikres:
* Kodeområder der bør kontrolleres:
* Mulige fejl/risici:
* Hvad bør testes:
* Næste anbefalede skridt:

Vigtig regel:
Hvis opgaven handler om én ting, må du ikke samtidig forbedre alt muligt andet.
