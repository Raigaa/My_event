const express = require('express');
const axios = require('axios');
require('dotenv').config();
const Hangout = require('../model/hangout.model');
const Participant = require('../model/participant.model');
const User = require('../model/user.model');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware pour loguer les requêtes
router.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  console.log('Request body:', req.body);
  console.log('Query parameters:', req.query);
  next();
});

// Route pour tester l'insertion de données
router.get('/test-insert', async (req, res) => {
  try {
    const newHangout = new Hangout({ owner: 'owner1', visibility: 'public' });
    await newHangout.save();
    const newParticipant = new Participant({
      hangout: newHangout._id,
      user: new mongoose.Types.ObjectId(),
    });
    await newParticipant.save();
    res.send('Documents inserted');
  } catch (error) {
    res.status(500).send('Error inserting documents: ' + error.message);
  }
});

// Route pour créer un nouveau hangout
router.post('/hangout', async (req, res) => {
  console.log('Received request body:', req.body);
  try {
    const { owner, visibility, participants, eventUid } = req.body;

    if (!owner || !visibility || !Array.isArray(participants) || !eventUid) {
      console.log('Invalid request data:', { owner, visibility, participants, eventUid });
      return res.status(400).send('Invalid request data');
    }

    const newHangout = new Hangout({ owner, visibility, eventUid });
    await newHangout.save();

    const participantDocs = await Promise.all(participants.map(async userId => {
      const participant = new Participant({
        hangout: newHangout._id,
        user: userId
      });
      await participant.save();
      return participant._id;
    }));

    newHangout.participants = participantDocs;
    await newHangout.save();

    console.log('Hangout created:', newHangout);
    res.status(201).send({ message: 'Hangout created', hangout: newHangout });
  } catch (error) {
    console.error('Error creating hangout:', error.message);
    res.status(500).send('Error creating hangout: ' + error.message);
  }
});



// Route pour récupérer les hangouts et leurs participants, ainsi que les informations d'événement associées
router.get('/hangouts', async (req, res) => {
  try {
    const hangouts = await Hangout.find().populate({
      path: 'participants',
      populate: {
        path: 'user',
        model: 'User'
      }
    });

    // Obtenir les détails des événements pour chaque hangout
    const hangoutsWithEventDetails = await Promise.all(hangouts.map(async (hangout) => {
      try {
        // Faire la requête pour obtenir les détails de l'événement
        const eventResponse = await axios.get(`http://localhost:3001/api/events/uid/${hangout.eventUid}`);
        const { title_fr, daterange_fr, location_address } = eventResponse.data;

        // Ajouter les détails de l'événement à l'objet hangout
        return {
          ...hangout.toObject(),
          event: {
            title_fr,
            daterange_fr,
            location_address
          }
        };
      } catch (error) {
        console.error(`Error fetching event for hangout ${hangout._id}:`, error.message);
        return {
          ...hangout.toObject(),
          event: null // Ajouter un champ événement vide en cas d'erreur
        };
      }
    }));

    res.status(200).json(hangoutsWithEventDetails);
  } catch (error) {
    console.error('Error fetching hangouts:', error.message);
    res.status(500).send('Error fetching hangouts: ' + error.message);
  }
});

// Route pour récupérer un hangout spécifique et ses participants, ainsi que les informations d'événement associées
router.get('/hangouts/event/:id', async (req, res) => {
  try {
    const hangout = await Hangout.findById(req.params.id).populate({
      path: 'participants',
      populate: {
        path: 'user',
        model: 'User'
      }
    });

    if (!hangout) {
      return res.status(404).send('Hangout not found');
    }

    const eventResponse = await axios.get(`http://localhost:3001/api/events/uid/${hangout.eventUid}`);
    const eventDetails = eventResponse.data;

    const hangoutWithEventDetails = {
      ...hangout.toObject(),
      event: eventDetails
    };

    res.status(200).json(hangoutWithEventDetails);
  } catch (error) {
    console.error('Error fetching hangout and event details:', error.message);
    res.status(500).send('Error fetching hangout and event details: ' + error.message);
  }
});

// Route pour rejoindre un hangout
router.post('/hangouts/:id/join', async (req, res) => {
  try {
    const hangoutId = req.params.id;
    const userId = req.body.userId;

    console.log(`Joining hangout with ID: ${hangoutId}`);
    console.log('User ID:', userId);

    const hangout = await Hangout.findById(hangoutId);
    if (!hangout) {
      console.log('Hangout not found');
      return res.status(404).send('Hangout not found');
    }

    console.log('Current participants:', hangout.participants);

    // Assurez-vous que les IDs sont des chaînes de caractères pour la comparaison
    const isUserAlreadyParticipant = hangout.participants.some(participantId => participantId.toString() === userId);
    
    if (isUserAlreadyParticipant) {
      console.log('User is already a participant');
      return res.status(400).send('User is already a participant');
    }

    hangout.participants.push(userId);
    await hangout.save();

    const newParticipant = new Participant({
      hangout: hangout._id,
      user: userId
    });
    await newParticipant.save();

    console.log('User added successfully');
    res.status(200).send('User has joined the hangout successfully');
  } catch (error) {
    console.error('Error adding participant:', error.message);
    res.status(500).send('Error adding participant: ' + error.message);
  }
});

// Route pour ajouter un participant à la collection et mettre à jour le hangout
router.post('/hangouts/:id/add-participant', async (req, res) => {
  try {
    const hangoutId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const hangout = await Hangout.findById(hangoutId);
    if (!hangout) {
      return res.status(404).json({ message: 'Hangout not found' });
    }

    const existingParticipant = await Participant.findOne({ hangout: hangoutId, user: userId });
    if (existingParticipant) {
      return res.status(400).json({ message: 'User is already a participant' });
    }

    const newParticipant = new Participant({
      hangout: hangoutId,
      user: userId
    });
    await newParticipant.save();

    hangout.participants.push(newParticipant._id);
    await hangout.save();

    res.status(201).json({ message: 'Participant added successfully' });
  } catch (error) {
    console.error('Error adding participant:', error.message);
    res.status(500).json({ message: 'Error adding participant', error: error.message });
  }
});



module.exports = router;
