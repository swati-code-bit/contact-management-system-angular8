const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ph_no: { type: String, required: true },
    email: { type: String, required: true },
    profile_pic: { type: String, required: true },
    bday: { type: Date, required: true },
    address: { type: String, required: true },
    category: {
      mainCategory: { type: String, required: true },
      subcategory: { type: String, required: true }
    },
    contactid: { type: Number, required: true }
  });
  
  const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;


  

// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({}, { strict: false });

// const Contact = mongoose.model('Contact', contactSchema);

// module.exports = Contact;