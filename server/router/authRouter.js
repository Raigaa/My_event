const express = require("express");
const axios = require("axios");
const session = require('express-session');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const User = require("../model/user.model");
const googleToken = process.env.GOOGLE_TOKEN;
const client = new OAuth2Client(googleToken);
const authRouter = express.Router();

authRouter.post('/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleToken + ".apps.googleusercontent.com",
        });

        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ googleId: sub });

        if (!user) {
            user = new User({
                googleId: sub,
                email,
                name,
                picture,
            });
            await user.save();
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            picture: user.picture,
        };

        res.status(200).json({ user });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

authRouter.get('/user/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: "L'utilisateur n'est pas connecté" });
    }
});

authRouter.post('/disconnect', (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la déconnexion" });
            }
            res.status(200).json({ message: "Utilisateur déconnecté" });
        });
    } else {
        res.status(404).json({ message: "Aucun utilisateur n'est connecté" });
    }
})

module.exports = authRouter;