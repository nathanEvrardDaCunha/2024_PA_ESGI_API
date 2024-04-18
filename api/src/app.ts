const express = require('express');
const cors = require('cors');

const app = express();

// Utilisation du middleware CORS
app.use(cors({
    origin: 'http://localhost:3001/' // mettre l'addresse du client web pour l'authorisée
}));
// Vos routes et autres configurations ici

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

