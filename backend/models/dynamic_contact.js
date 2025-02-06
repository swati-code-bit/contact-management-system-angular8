const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({}, { strict: false });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;