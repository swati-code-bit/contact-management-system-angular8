const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  formName: { type: String, required: true },
  schema: { type: Object, required: true },
});

module.exports = mongoose.model('Form', formSchema);
