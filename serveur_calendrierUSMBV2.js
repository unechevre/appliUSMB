const express = require('express');
const axios = require('axios');
const ical = require('node-ical');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Importez le fichier salleData.json
const salleData = require('./salles.json');
// Fonction pour récupérer les valeurs de lat et lng en fonction de la salle
const getLatLongForSalle = (salle) => {
  const salleInfo = salleData.find((data) => data.salle === salle);
  return salleInfo ? { lat: salleInfo.lat, lng: salleInfo.lng } : null;
};

app.get('/recuperer_calendrier', async (req, res) => {
  const remoteCalendarUrl = req.query.url;


  
  if (!remoteCalendarUrl) {
    return res.status(400).send('L\'URL du calendrier distant est requise.');
  }

  try {
    const response = await axios.get(remoteCalendarUrl);

    if (response.status === 200) {
      // Écrire le fichier .ics
      fs.writeFileSync('calendrier.ics', response.data, 'utf-8');

      // Parser le contenu du fichier .ics avec node-ical
      const parsedData = ical.sync.parseICS(response.data);

      // Récupérer les événements et extraire le premier mot de la location
      const events = [];
      for (const key in parsedData) {
        if (parsedData[key].type === 'VEVENT') {
          const locationFirstWord = parsedData[key].location.split(' ')[0]; // Extraction du premier mot
          const descriptionFirstPart = parsedData[key].description.split('\\')[0];

                    // Récupérer les valeurs de lat et lng en fonction de la salle
        const salleInfo = getLatLongForSalle(locationFirstWord);

        if (salleInfo) {
          // Ajouter les valeurs de lat et lng
          parsedData[key].lat = salleInfo.lat;
          parsedData[key].lng = salleInfo.lng;
        }

          parsedData[key].location = locationFirstWord; // Ajout du premier mot au JSON

          parsedData[key].description = descriptionFirstPart

          events.push(parsedData[key]);
        }
      }

      // Afficher les événements
      //events.forEach((event, index) => {
        //console.log(`Événement ${index + 1}:`);
        //console.log('Summary:', event.summary);
        //console.log('Description:', event.description);
        //console.log('Start:', event.start);
        //console.log('End:', event.end);
        //console.log('Location:', event.location);
        //console.log('---');
      //});
      //console.log(events)

      res.json(events);
    } else {
      return res.status(500).send('Erreur lors de la récupération du calendrier distant.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du calendrier distant:', error.message);
    return res.status(500).send('Erreur lors de la récupération du calendrier distant.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

//* const url = "https://ade-usmb-ro.grenet.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=b5cfb898a9c27be94975c12c6eb30e9233bdfae22c1b52e2cd88eb944acf5364c69e3e5921f4a6ebe36e93ea9658a08f,1&resources=4302&projectId=1&calType=ical&lastDate=2042-08-14";

//const encodedUrl = encodeURIComponent(url);

// Utilisez encodedUrl dans votre requête