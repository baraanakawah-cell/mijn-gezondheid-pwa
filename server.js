// =========================================
// STAP 1: Benodigde packages inladen
// =========================================
const express = require('express');
const app     = express();
const PORT    = 3000;
app.use(express.static('public'));

// =========================================
// STAP 2: Helper functie voor HTML pagina's
// Hiermee hoef je de HTML-structuur niet
// elke keer opnieuw te schrijven.
// =========================================
function maakPagina(titel, inhoud) {
    return `
        <!DOCTYPE html>
        <html lang="nl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titel} – Mijn Gezondheid</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <header class="app-header">
                <h1>🥗 Mijn Gezondheid</h1>
                <nav class="hoofd-nav">
                    <a href="/">🏠 Home</a>
                    <a href="/dashboard">📊 Dashboard</a>
                    <a href="/toevoegen">➕ Toevoegen</a>
                    <a href="/about">ℹ️ Over</a>
                    <a href="/contact">📬 Contact</a>
                </nav>
            </header>
            <main>
                ${inhoud}
            </main>
            <footer>Mijn Gezondheid App – 2026</footer>
        </body>
        </html>
    `;
}

// =========================================
// STAP 3: Pagina-routes (sturen HTML terug)
// =========================================

// Route 1: Homepagina
app.get('/', (req, res) => {
    const inhoud = `
        <h1>🎬 Welkom bij Mijn Films!</h1>
        <p>Met deze app houd je bij welke films je hebt gezien.</p>
        <ul>
            <li>🎥 Films toevoegen</li>
            <li>⭐ Films beoordelen</li>
            <li>📋 Watchlist bijhouden</li>
        </ul>
        <a href="/dashboard">Naar dashboard →</a>
    `;
    res.send(maakPagina('Home', inhoud));
});

// Route 2: Dashboard
app.get('/dashboard', (req, res) => {
    const inhoud = `
        <h1>📊 Dashboard</h1>
        <p>Hier komt later jouw filmoverzicht.</p>
        <p><em>In week 6 bouwen we dit uit met echte data!</em></p>
    `;
    res.send(maakPagina('Dashboard', inhoud));
});

// Route 3: Over de app
app.get('/about', (req, res) => {
    const inhoud = `
        <h1>ℹ️ Over Deze App</h1>
        <p>Gebouwd als onderdeel van de module "Eenvoudige Mobiele App".</p>
        <p>Gemaakt door: <strong>[jouw naam]</strong></p>
    `;
    res.send(maakPagina('Over de App', inhoud));
});


// 👇 HIER PLAATS JE CONTACT
app.get('/contact', (req, res) => {
    const inhoud = `
        <h1>📬 Contact</h1>
        <p>Naam: jouw naam</p>
        <p>Klas: jouw klas</p>
        <p>Email: nep@mail.com</p>
    `;
    res.send(maakPagina('Contact', inhoud));
});


// =========================================
// STAP 4: API-routes (sturen JSON terug)
// =========================================

// API-route: basisinformatie van de app
app.get('/api/info', (req, res) => {
    res.json({
        naam:    'Mijn Films',
        versie:  '1.0.0',
        student: '[jouw naam]'
    });
});

app.get('/api/profiel', (req, res) => {
    res.json({
        naam: 'Baraa',
        klas: 'B1S',
        doel: 'Een films-PWA bouwen!'
    });
});

// API-route: voorbeelddata (later uit LocalStorage)
app.get('/api/items', (req, res) => {
    const voorbeeldData = [
        { id: 1, categorie: 'actie',    omschrijving: 'The Dark Knight'    },
        { id: 2, categorie: 'komedie',  omschrijving: 'Home Alone'         },
        { id: 3, categorie: 'animatie', omschrijving: 'Spider-Man: Into the Spider-Verse' }
    ];
    res.json(voorbeeldData);
});

// =========================================
// STAP 5: 404-pagina (altijd als laatste!)
// =========================================
app.use((req, res) => {
    res.status(404).send(maakPagina(
        '404 – Niet gevonden',
        `<h1>😕 Pagina niet gevonden</h1>
         <p>De URL <code>${req.url}</code> bestaat niet.</p>
         <a href="/">← Terug naar home</a>`
    ));
});

// =========================================
// STAP 6: Server starten
// =========================================
app.listen(PORT, () => {
    console.log(`✅ Server draait op http://localhost:${PORT}`);
    console.log('📋 Routes:');
    console.log('   http://localhost:3000/');
    console.log('   http://localhost:3000/dashboard');
    console.log('   http://localhost:3000/about');
    console.log('   http://localhost:3000/api/info');
    console.log('   http://localhost:3000/api/items');
    console.log('   http://localhost:3000/contact');
    console.log('   http://localhost:3000/api/profiel');
});