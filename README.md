# Documentazione Back-end
Istruzioni per configurazione del back-end e del database.

##  Clonare il progetto da Github

1. Andare alla pagina del repository su GitHub https://github.com/LucreziaAB/testAIMAGE_BE
2. Cliccare su Code e poi su icona "copia" per copiare l'URL del repository
3. Aprire un terminale sul tuo computer.
4. Navigare alla cartella in cui vuoi clonare il progetto usando il comando ```cd```
5. Eseguire il comando: ```
git clone <URL-del-repository> ```, sostituendo ```<URL-del-repository>``` con l'URL copiato.

## Aprire il Database

1. Scaricare XAMPP e installarlo.
2. Aprire il pannello di controllo di XAMPP.
3. Avvia i servizi Apache e MySQL cliccando sui pulsanti  ```Start ``` accanto a ciascun servizio.
4. Accedere a phpMyAdmin premendo il tasto  ```Admin ``` nella riga di MySQL accanto al tasto  ```Start ```
5. Nella pagina principale di phpMyAdmin, cliccare su  ```Databases ``` nella barra di navigazione in alto.
6. Nella sezione "Crea nuovo database", inserire il nome  ```formdb ```  nel campo "Nome database".
7. Cliccare su  ```Crea ``` per creare il database.
8. Nella pagina che si apre, cliccare su  ```Importa ```  nella barra di navigazione in alto e selezionare  ```form_data.sql ``` presente nella cartella ```file_da_scaricare_per_setup``` del repository.

## Avviare un Progetto con NPM

1. Aprire il terminale.
2. Navigare alla cartella del progetto con `cd <percorso-cartella>`.
3. Eseguire `npm install` per installare le dipendenze.
    - Dipendenze installate: Tutte le librerie e pacchetti elencati in `package.json` sotto:
        - `"dependencies"`: Pacchetti necessari per il funzionamento dell'app in produzione.
        - `"devDependencies"`: Pacchetti necessari solo per lo sviluppo (es. strumenti di test, linter).
4. Avviare il progetto con `node form-backend.js`.
5. Aprire un browser e visitare  visitare http://localhost:3001/ per vedere il progetto in esecuzione.

## Utilizzo degli endpoint esposti


1. Scaricare, installare e aprire Postman sul computer.
2. Cliccare su ```Collections``` nella barra laterale sinistra e su ```Import``` in alto sulla finestra che si apre.
3. Trascinare il file della collezione API ```back-end.postman_collection.json```, presente nella cartella ```file_da_scaricare_per_setup``` del repository,  per caricare il file.
4. Esplorare la collezione importata nella scheda Collections nella barra laterale sinistra.
5. Selezionare una richiesta all'interno della collezione per visualizzarla.
6. Verificare l'URL e il metodo HTTP per assicurarsi che siano corretti.
7.  Modificare il corpo della richiesta (se necessario) nella scheda ```Body```.
8.  Cliccare su ```Send``` per inviare la richiesta all'API.
9.  Visualizzare la risposta nella parte inferiore dello schermo.
10. Ripetere i passaggi per altre richieste all'interno della stessa collezione se necessario.

### NOTA: Estrazione dati da database

1. Fare richiesta all'API ```export```
2. File estratto viene salvato nella cartella di back-end 
