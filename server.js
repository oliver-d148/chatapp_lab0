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
    const sql = "SELECT ID, Topic FROM chats";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Fehler beim Abrufen der Daten", error: err });
        }
        res.json(result);
        //console.log(res.json(result));
    });
});

app.get('/topic/:id', (req, res) => {
    const chatId = req.params.id;

    //const sql = 'SELECT sender, content FROM inhalt WHERE chat_id = ?';
    const sql = `
        SELECT c.Topic, i.sender, i.content 
        FROM chats c 
        LEFT JOIN inhalt i ON c.ID = i.chat_id 
        WHERE c.ID = ?;
    `;

    db.query(sql, [chatId], (err, results) => {
        if (err) return res.status(500).json({ message: "Fehler beim Abrufen", error: err });
        //res.json(results);
        const topic_Name = results[0].Topic;

        res.json({ topic: topic_Name, chats: results });
    });
});

// POST-Route für Formulardaten
app.post("/submit", (req, res) => {
    const { topic } = req.body;
    const topic2 = req.body.topic;

    if (!topic2) return res.status(400).json({ message: "Topic ist erforderlich" });

    const sql = "INSERT INTO chats (Topic) VALUES (?)";
    db.query(sql, [topic2], (err, result) => {
        if (err) return res.status(500).json({ message: "Fehler beim Speichern", error: err });
        //res.json({ message: "Daten erfolgreich gespeichert!" });
    });
});

app.post("/submit-message", (req, res) => {
    const { sender, content, chat_id } = req.body;
    const sender2 = req.body.sender;
    const scontent2 = req.body.content;
    const chat_id2 = req.body.chat_id;

    if (!sender || !content ) return res.status(400).json({ message: "Alle Felder sind erforderlich!" });
    

    const sql = "INSERT INTO inhalt (sender, content, chat_id) VALUES (?, ?, ?)";
    db.query(sql, [sender2, scontent2, chat_id2], (err, result) => {
        if (err) return res.status(500).json({ message: "Fehler beim Speichern", error: err });
        //res.json({ message: "Nachricht erfolgreich gespeichert!" });
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
