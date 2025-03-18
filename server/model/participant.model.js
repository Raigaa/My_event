const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    hangout: { type: mongoose.Schema.Types.ObjectId, ref: 'Hangout', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;