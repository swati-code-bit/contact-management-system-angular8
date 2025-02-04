const Form = require('../models/form');

exports.saveForm = async (req, res) => {
  const { formName, schema } = req.body;

  try {
    const newForm = new Form({
      formName,
      schema,
    });

    await newForm.save();
    res.status(200).json({ message: 'Form saved successfully', form: newForm });
  } catch (error) {
    res.status(500).json({ message: 'Error saving form schema', error });
  }
};

exports.getFormNames = async (req, res) => {
  try {
    const forms = await Form.find({}, 'formName');
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form names', error });
  }
};

