const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const res = require("express/lib/response");
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const cors = require('cors');

dotenv.config();
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

db.connect((err) => {
    if (err) {
        return res.status(500).send({message: 'Connessione al db fallita.'});
    }
})

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: process.env.ORIGIN}));

app.post('/auth', (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    };

    if (user.name === process.env.USER_NAME_TEST && user.password === process.env.USER_PASS_TEST) {
        // Creazione dei token JWT
        const accessToken = jwt.sign(
            {user},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "5m"}
        );

        const refreshToken = jwt.sign(
            {user},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "5d"}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 5 * 24 * 60 * 60 * 1000
        });

        return res.json({accessToken});
    } else
        return res.status(401).send("Non autorizzato. Utilizzare credenziali fornite nella documentazione.");
});

app.get('/refresh', (req, res) => {
    if (req.cookies?.refreshToken) {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify( //Token nei cookie è corretto
            refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, authData) => {
                if (err)
                    return res.status(406).send("Non autorizzato. Necessario effettuare l'accesso.");
                else {
                    const user = {
                        name: authData.user.name,
                        password: authData.user.password
                    };

                    // Creazione token JWT refreshato
                    const refreshedToken = jwt.sign(
                        {user},
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: "5m"}
                    );

                    return res.json({refreshedToken});
                }
            }
        );
    } else
        return res.status(406).send("Non autorizzato. Token non trovato.")
});

app.post('/retrieve', verifyToken, (req, res) => {
    db.query('SELECT * FROM FORM_DATA', (err, results) => {
        if (err)
            return res.status(500).send("Errore durante la query.");
        else
            return res.json(results);
    })
});

app.post("/export", verifyToken, (req, res) => {
    db.query('SELECT * FROM FORM_DATA', (err, results) => {
        if (err)
            return res.status(500).send("Errore durante la query.");
        else {

            const csv = createCsvWriter({
                path: 'output.csv',
                header: Object.keys(results[0]).map((key) => ({id: key, title: key}))
            });

            csv.writeRecords(results).then(() => {
                return res.status(200).send("Dati esportati nel file output.csv")
            });
        }
    })
});

app.post('/save-data', checkData, (req, res) => {
    //Verifico che una dei due dati possibilmente univoci sia presente o no nel DB
    db.query('UPDATE form_data SET nome = ?, cognome = ?, telefono = ?, email = ?, corso = ? WHERE form_data.telefono = ? or form_data.email = ?', [req.body.nome, req.body.cognome, req.body.telefono, req.body.email, req.body.corso, req.body.telefono, req.body.email], (err, row) => {
        if (err) {
            return res.status(500).json({message: 'Errore durante la query di aggiornamento del dato.'});
        }
        else if (row.affectedRows === 0 && row.changedRows === 0) {
            //row = #righe modificate
            //Creo nuova entry in quanto dati non esistenti
            db.query('INSERT INTO form_data (nome, cognome, telefono, email, corso) VALUES (?, ?, ?, ?, ?)', [req.body.nome, req.body.cognome, req.body.telefono, req.body.email, req.body.corso], (err) => {
                if (err) {
                    return res.status(500).json({message: 'Errore durante la query di aggiunta del nuovo dato.'});
                }
                return res.status(200).send("added");
            });
        }
        else if (row.affectedRows === 1 && row.changedRows === 0){
            return res.status(200).send("not_needed");
        }
        else {
            return res.status(200).send("updated");
        }
    });
});


//Accesso a db
function verifyToken(req, res, next) {
    const token = req.body.accessToken;
    jwt.verify(
        token, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err)
                return res.status(406).send("Messaggio di errore da JWT: " + err.message + ".\n Aggiornare il token o rifare l'accesso.");
            else next();
        }
    )
}

const isAlpha = str => /^[a-zA-Z]+$/.test(str);
const isNum = str => /^[0-9]+$/.test(str);
const isMail = str => /^\S+@\S+.\S+$/.test(str);

function checkData(req, res, next) {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const telefono = req.body.telefono;
    const email = req.body.email;

    if(!isAlpha(nome)){
        return res.status(406).json({message: 'Il nome contiene caratteri non letterali!'});
    }
    if (!isAlpha(cognome)){
        return res.status(406).json({message: 'Il cognome contiene caratteri non letterali!'});
    }
    if (!isNum(telefono)){
        return res.status(406).json({message: 'Il telefono contiene caratteri non numerici!'});
    }
    if (!isMail(email)){
        return res.status(406).json({message: 'La mail non è formattata correttamente!'});
    }
    next();
} //fine checkData

app.listen(process.env.PORT, () => {
    console.log('Server in ascolto sulla porta ' + process.env.PORT + '.')
});

