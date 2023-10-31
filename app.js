// Kontaktformular
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://127.0.0.1:5501',
  methods: 'POST',
};

app.post("/sendContact", cors(corsOptions), (req, res) => {
  const {
    inputVornameKontaktHTML,
    inputNachnameKontaktHTML,
    inputEmailKontaktHTML,
    inputWebsiteKontaktHTML,
    inputDescriptionKontaktHTML
  } = req.body;


  // EmailHandler, welcher die Kontaktformular Daten an eine andere Email sendet.
  // Die Vorbereitung und Weiterverarbeitung der Daten
  const emailSender = nodemailer.createTransport({
    service: 'yourFavEmailProvider',
    auth: {
      user: 'yourEmail@email.com',
      pass: 'youEmailPassword'
    }
  });
  // MailOptions für die Emails. "From" stellt dabei die Email da, welche oben bei "user" steht und "to" die Email, an welche das geschickt werden soll
  const mailOptions = {
    from: 'yourEmail@email.com', // z.B. info@techrise-marketing.de
    to: 'theEmailYouWantToForwardTheEmailTo@email.com',
    subject: `Neue Kontaktanfrage von ${inputVornameKontaktHTML} + " " + ${inputNachnameKontaktHTML}`,
    text: `Vorname: ${inputVornameKontaktHTML}\n Nachname: ${inputNachnameKontaktHTML}\n E-Mail: ${inputEmailKontaktHTML}\n Website: ${inputWebsiteKontaktHTML}\n Anliegen: ${inputDescriptionKontaktHTML}`
  };

  emailSender.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Fehler beim Absenden der Daten" });
    } else {
      console.log('E-Mail gesendet: ' + info.response);
      res.json({ message: "Daten erfolgreich gesendet" });
    }
  });
});
// Noch unfunktional
// Vorbereitungen für den Login von Mitarbeitern und Kunden
// Soll später dafür genutzt werden um Mitarbeitern die Möglichkeit zu geben
// Ihre Zeiterfassungsdaten, offene Termine, Supportanfragen, möglicherweise Emails (Brainstormen wie man das umsetzt), usw. ersichtlich 
// zu machen ohne 10 verschiedene Applikationen zum einsehen der Daten
// Benutzer- Mitarbeiterlogin

// MySQL-Datenbankverbindung erstellen
const connection = mysql.createConnection({
  host: 'whatEverTheIpIsWhereYouHostYourDatabase',
  user: 'yourDatabaseUser',
  password: 'yourDatabasePassword',
  database: 'yourDatabaseName'
});

// Verbindung zur Datenbank herstellen
connection.connect((err) => {
  if (err) {
      console.error('Fehler beim Verbinden zur Datenbank: ' + err.stack);
      return;
  }
  console.log('Erfolgreich zur Datenbank verbunden als ID ' + connection.threadId);
});

// POST-Anfrage für die Anmeldung aus dem Frontend(script.js) verarbeiten
app.post('/sendLogin', (req, res) => {
  const { username, password } = req.body;

  // Datenbankabfrage, um die Anmeldeinformationen mit der Datenbank gegenzuchecken
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results) => {
      if (error) {
          console.error('Datenbankfehler: ' + error.message);
          res.json({ success: false, message: 'Fehler bei der Anmeldung.' });
      } else {
          if (results.length > 0) {
              res.json({ success: true });
          } else {
              res.json({ success: false, message: 'Ungültige Anmeldeinformationen.' });
          }
      }
  });
});


// Den Server auf Port 3000 hosten
app.listen(3000, () => {
  console.log(`Server läuft auf http://localhost:3000`);
});