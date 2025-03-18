const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27042/my_events');
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;