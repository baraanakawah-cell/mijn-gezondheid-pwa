// =========================================
// SERVICE WORKER REGISTREREN
// =========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function() {
                console.log('Service worker geregistreerd!');
            })
            .catch(function(err) {
                console.log('Service worker mislukt:', err);
            });
    });
}

// =========================================
// LOCALSTORAGE FUNCTIES - MAALTIJDEN
// =========================================
function getMaaltijden() {
    const data = localStorage.getItem('maaltijden');
    return data ? JSON.parse(data) : [];
}

function saveMaaltijden(maaltijden) {
    localStorage.setItem('maaltijden', JSON.stringify(maaltijden));
}

function voegMaaltijdToe(maaltijd) {
    const maaltijden = getMaaltijden();
    maaltijd.id = Date.now();
    maaltijden.push(maaltijd);
    saveMaaltijden(maaltijden);
}

function verwijderMaaltijd(id) {
    const maaltijden = getMaaltijden();
    const nieuw = maaltijden.filter(m => m.id !== id);
    saveMaaltijden(nieuw);
}

// =========================================
// LOCALSTORAGE FUNCTIES - ACTIVITEITEN
// =========================================
function getActiviteiten() {
    const data = localStorage.getItem('activiteiten');
    return data ? JSON.parse(data) : [];
}

function voegActiviteitToe(activiteit) {
    const activiteiten = getActiviteiten();
    activiteit.id = Date.now();
    activiteiten.push(activiteit);
    localStorage.setItem('activiteiten', JSON.stringify(activiteiten));
}

// =========================================
// PAGINA: TOEVOEGEN
// =========================================
const maaltijdForm = document.getElementById('maaltijd-form');

if (maaltijdForm) {
    document.getElementById('datum').valueAsDate = new Date();

    maaltijdForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const maaltijd = {
            categorie:    document.getElementById('categorie').value,
            datum:        document.getElementById('datum').value,
            omschrijving: document.getElementById('omschrijving').value,
            kcal:         Number(document.getElementById('kcal').value)
        };

        voegMaaltijdToe(maaltijd);
        maaltijdForm.reset();
        document.getElementById('datum').valueAsDate = new Date();

        alert('Maaltijd opgeslagen!');
        window.location.href = 'dashboard.html';
    });
}

// =========================================
// PAGINA: DASHBOARD
// =========================================
const itemsLijst = document.getElementById('items-lijst');
const filterKnoppen = document.querySelectorAll('.filter-knop');

let huidigePeriode = 'dag';

function filterOpPeriode(maaltijden, periode) {
    const nu = new Date();

    return maaltijden.filter(m => {
        const datum = new Date(m.datum);

        if (periode === 'dag') {
            return datum.toDateString() === nu.toDateString();
        }

        if (periode === 'week') {
            const eenWeekGeleden = new Date();
            eenWeekGeleden.setDate(nu.getDate() - 7);
            return datum >= eenWeekGeleden && datum <= nu;
        }

        if (periode === 'maand') {
            return datum.getMonth() === nu.getMonth() &&
                   datum.getFullYear() === nu.getFullYear();
        }

        return true;
    });
}

function toonDashboard() {
    if (!itemsLijst) return;

    const maaltijden = getMaaltijden();
    const gefilterd = filterOpPeriode(maaltijden, huidigePeriode);

    if (gefilterd.length === 0) {
        itemsLijst.innerHTML = '<p class="geen-items">Geen items gevonden voor deze periode.</p>';
        return;
    }

    itemsLijst.innerHTML = gefilterd.map(m => `
    <div class="dashboard-kaart ${m.categorie}">
            <div class="dashboard-kaart-info">
                <span class="dashboard-kaart-categorie">${m.categorie}</span>
                <span class="dashboard-kaart-omschrijving">${m.omschrijving}</span>
                <span class="dashboard-kaart-kcal">${m.kcal} kcal</span>
                <span class="dashboard-kaart-datum">${m.datum}</span>
            </div>
            <button class="knop-verwijder" data-id="${m.id}">Verwijder</button>
        </div>
    `).join('');

    document.querySelectorAll('.knop-verwijder').forEach(knop => {
        knop.addEventListener('click', function() {
            const id = Number(this.dataset.id);
            verwijderMaaltijd(id);
            toonDashboard();
        });
    });
}

if (itemsLijst) {
    toonDashboard();

    filterKnoppen.forEach(knop => {
        knop.addEventListener('click', function() {
            filterKnoppen.forEach(k => k.classList.remove('actief'));
            this.classList.add('actief');
            huidigePeriode = this.dataset.periode;
            toonDashboard();
        });
    });
}

// =========================================
// PAGINA: HOME (recente items)
// =========================================
const recenteItems = document.getElementById('recente-items');

if (recenteItems) {
    const maaltijden = getMaaltijden();
    const laatste3 = maaltijden.slice(-3).reverse();

    if (laatste3.length === 0) {
        recenteItems.innerHTML = '<h2>Recente invoer</h2><p class="geen-items">Nog geen maaltijden toegevoegd.</p>';
    } else {
        recenteItems.innerHTML = '<h2>Recente invoer</h2>' + laatste3.map(m => `
            <article class="item-kaart">
                <div class="item-info">
                    <span class="item-kcal">${m.kcal} kcal</span>
                    <span class="item-datum">${m.datum}</span>
                    <span class="item-omschrijving">${m.omschrijving}</span>
                </div>
            </article>
        `).join('');
    }
}

// =========================================
// PAGINA: SPORT BEREKENEN
// =========================================
const maaltijdSelect = document.getElementById('maaltijd-select');
const sportSelect    = document.getElementById('sport-select');
const gewichtInput   = document.getElementById('gewicht');
const berekenKnop    = document.getElementById('bereken-knop');
const resultaat      = document.getElementById('resultaat');
const resultaatTekst = document.getElementById('resultaat-tekst');
const bevestigKnop   = document.getElementById('bevestig-knop');

if (maaltijdSelect) {

    const opgeslagenGewicht = localStorage.getItem('gewicht');
    if (opgeslagenGewicht) {
        gewichtInput.value = opgeslagenGewicht;
    }

    const maaltijden = getMaaltijden();
    maaltijden.forEach(m => {
        const optie = document.createElement('option');
        optie.value = m.kcal;
        optie.textContent = `${m.omschrijving} (${m.kcal} kcal)`;
        maaltijdSelect.appendChild(optie);
    });

    let huidigeBerekening = null;

    berekenKnop.addEventListener('click', function() {
        const kcal = Number(maaltijdSelect.value);
        const met  = Number(sportSelect.value);
        const gewicht = Number(gewichtInput.value);
        const sportNaam = sportSelect.options[sportSelect.selectedIndex].text;

        if (!kcal || !gewicht) {
            alert('Vul je gewicht in en kies een maaltijd.');
            return;
        }

        localStorage.setItem('gewicht', gewicht);

        const tijdInUren = kcal / (met * gewicht);
        const tijdInMinuten = Math.round(tijdInUren * 60);

        resultaatTekst.textContent = `Om ${kcal} kcal te verbranden met ${sportNaam.toLowerCase()}, moet je ongeveer ${tijdInMinuten} minuten sporten.`;
        resultaat.hidden = false;

        huidigeBerekening = {
            sport: sportNaam,
            kcal: kcal,
            datum: new Date().toISOString().split('T')[0]
        };
    });

    bevestigKnop.addEventListener('click', function() {
        if (!huidigeBerekening) return;

        voegActiviteitToe(huidigeBerekening);
        alert('Sport opgeslagen!');
        resultaat.hidden = true;
        huidigeBerekening = null;
    });
}

// =========================================
// DIAGRAM: INGENOMEN VS VERBRAND
// =========================================
const diagramElement = document.getElementById('diagram');

function toonDiagram() {
    if (!diagramElement) return;

    const maaltijden = getMaaltijden();
    const activiteiten = getActiviteiten();

    const totaalIngenomen = maaltijden.reduce((som, m) => som + m.kcal, 0);
    const totaalVerbrand = activiteiten.reduce((som, a) => som + a.kcal, 0);

    const maxWaarde = Math.max(totaalIngenomen, totaalVerbrand, 1);

    const percentageIngenomen = Math.round((totaalIngenomen / maxWaarde) * 100);
    const percentageVerbrand = Math.round((totaalVerbrand / maxWaarde) * 100);

    diagramElement.innerHTML = `
        <div class="diagram-rij">
            <div class="diagram-label">
                <span>Ingenomen</span>
                <span>${totaalIngenomen} kcal</span>
            </div>
            <div class="diagram-balk-achtergrond">
                <div class="diagram-balk ingenomen" style="width: ${percentageIngenomen}%"></div>
            </div>
        </div>

        <div class="diagram-rij">
            <div class="diagram-label">
                <span>Verbrand</span>
                <span>${totaalVerbrand} kcal</span>
            </div>
            <div class="diagram-balk-achtergrond">
                <div class="diagram-balk verbrand" style="width: ${percentageVerbrand}%"></div>
            </div>
        </div>
    `;
}

toonDiagram();