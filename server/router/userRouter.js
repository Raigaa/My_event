const express = require("express");
const axios = require("axios");
require("dotenv").config();
const Hangout = require("../model/hangout.model");
const Participant = require("../model/participant.model");
const User = require("../model/user.model");
const router = express.Router();
const mongoose = require("mongoose");

// Middleware de journalisation
router.use((req, res, next) => {
  console.log("userRouter request");
  console.log(`Received ${req.method} request at ${req.url}`);
  console.log("Request body:", req.body);
  console.log("Query parameters:", req.query);
  next();
});

// Route pour récupérer les utilisateurs
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message,
    });
  }
});

// Route pour récupérer tout sauf un utilisateur particulier
router.get("/users/exclude/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }
    const users = await User.find({ _id: { $ne: userId } });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
});

router.post("/generateuser", async (req, res) => {
  try {
    const newUser = new User({
      googleId: "",
      email: "",
      name: "",
      picture:
        "",
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message,
      });
  }
});

module.exports = router;
