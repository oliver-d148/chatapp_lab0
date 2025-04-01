const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs'); // EJS als Template-Engine
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

// Verbindung zur MariaDB
const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // Dein MariaDB-Benutzername
    password: "lcss",      // Dein MariaDB-Passwort
    database: "existing_chats"
});

// Route zum Abrufen aller Topics
app.get("/topic", (req, res) => {
    const sql = "SELECT Topic FROM chats";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Fehler beim Abrufen der Daten", error: err });
        }
        res.json(result);
        //console.log(res.json(result));
    });
});

app.get('/topic/:content', (req, res) => {
    //const chatid = req.params.chatid;

    const sql = 'SELECT sender, content FROM inhalt WHERE chat_id = 1';
    db.query(sql, [req.params.ID], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('topic', { Topic: results[0] });
        } else {
            res.status(404).send('Seite nicht gefunden');
        }
    });
});

// POST-Route für Formulardaten
app.post("/submit", (req, res) => {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ message: "Topic ist erforderlich" });

    const sql = "INSERT INTO chats (Topic) VALUES (?)";
    db.query(sql, [topic], (err, result) => {
        if (err) return res.status(500).json({ message: "Fehler beim Speichern", error: err });
        //res.json({ message: "Daten erfolgreich gespeichert!" });
    });
});



// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
