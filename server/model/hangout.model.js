const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const hangoutSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    visibility: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
    eventUid: { type: Number, required: true },
});

hangoutSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Hangout = mongoose.model('Hangout', hangoutSchema);

module.exports = Hangout;
