const Contact = require("../models/contact");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const mongoose = require("mongoose");

const generateUniqueContactId = async () => {
  const contactId = new ObjectId().toString();
  return contactId;
};

const formatDateToDDMMYYYY = (dateStr) => {
  let momentDate = moment(dateStr, "DD-MM-YYYY", true);
  if (!momentDate.isValid()) {
    momentDate = moment(dateStr);
  }
  return momentDate.isValid() ? momentDate.format("DD-MM-YYYY") : null;
};

const isValidDate = (dateStr) => {
  if (moment(dateStr, "DD-MM-YYYY", true).isValid()) {
    return true;
  }
  const date = moment(dateStr);
  return date.isValid();
};

exports.createContact = async (req, res) => {
  const {
    name,
    ph_no,
    email,
    profile_pic,
    bday,
    address,
    category,
    contactid,
  } = req.body;

  try {
    if (!bday) {
      return res.status(400).json({
        message: "Birthday is required in DD-MM-YYYY format.",
      });
    }

    if (!isValidDate(bday)) {
      return res.status(400).json({
        message:
          "Invalid date format for birthday. Use DD-MM-YYYY format (e.g., 31-12-2023).",
      });
    }

    const randomContactId = Math.floor(Math.random() * 1000000000);

    if (!category || !category.mainCategory || !category.subcategory) {
      return res.status(400).json({
        message: "Both category and subcategory are required.",
      });
    }

    const contactId = contactid || randomContactId;

    const formattedBday = formatDateToDDMMYYYY(bday);

    if (!formattedBday) {
      return res.status(400).json({
        message: "Could not format the provided birthday correctly.",
      });
    }

    const contact = new Contact({
      name,
      ph_no,
      email,
      profile_pic,
      bday: formattedBday,
      address,
      category: {
        mainCategory: category.mainCategory,
        subcategory: category.subcategory,
      },
      contactid: contactId,
    });

    await contact.save();

    res.status(201).json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    const formattedContacts = contacts.map((contact) => ({
      ...contact.toObject(),
      bday: formatDateToDDMMYYYY(contact.bday),
    }));

    res.status(200).json(formattedContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContactById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid ID format. Must be a valid MongoDB ObjectId.",
    });
  }

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      ...contact.toObject(),
      bday: formatDateToDDMMYYYY(contact.bday),
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  console.log("reached updateContact from controller");
  console.log("req.body", req.body);
  const { id } = req.params;
  const {
    name,
    ph_no,
    email,
    profile_pic,
    bday,
    address,
    mainCategory,
    subcategory,
  } = req.body;

  console.log("name", name);

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Validate the birthday date if provided
    if (bday && !isValidDate(bday)) {
      return res
        .status(400)
        .json({ message: "Invalid date format for birthday. Use DD-MM-YYYY." });
    }

    // If bday is in the format "DD-MM-YYYY", convert it to a Date object
    if (bday) {
      const formattedBday = moment(bday, "DD-MM-YYYY").toDate(); // Convert the date string to a Date object
      if (!formattedBday) {
        return res
          .status(400)
          .json({ message: "Invalid date format for birthday." });
      }
      contact.bday = formattedBday; // Assign the formatted date to the contact
    }

    // Update other contact fields
    if (name !== undefined) contact.name = name;
    if (ph_no !== undefined) contact.ph_no = ph_no;
    if (email !== undefined) contact.email = email;
    if (profile_pic !== undefined) contact.profile_pic = profile_pic;
    if (address !== undefined) contact.address = address;
    if (mainCategory !== undefined)
      contact.category.mainCategory = mainCategory;
    if (subcategory !== undefined) contact.category.subcategory = subcategory;

    console.log(
      "Updated contact.name data from contactController:",
      contact.name
    );
    console.log("Updated contact data from contactController:", contact);

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error during update:", error); // Log the error to help with debugging
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  console.log("reached deleteContact from ctrller");
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchContacts = async (req, res) => {
  const { searchType, searchInput } = req.body;

  try {
    let query = {};

    if (searchType === "phone") {
      query.ph_no = new RegExp(searchInput, "i");
    } else if (searchType === "birthday") {
      const [startDate, endDate] = searchInput
        .split("to")
        .map((date) => date.trim());

      if (startDate && endDate) {
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
          return res.status(400).json({
            message: "Invalid date format. Use DD-MM-YYYY to DD-MM-YYYY.",
          });
        }

        query.bday = {
          $gte: formatDateToDDMMYYYY(startDate),
          $lte: formatDateToDDMMYYYY(endDate),
        };
      } else {
        return res.status(400).json({
          message:
            "Invalid date range format. Please use DD-MM-YYYY to DD-MM-YYYY.",
        });
      }
    } else if (["name", "email", "address"].includes(searchType)) {
      query[searchType] = new RegExp(searchInput, "i");
    } else {
      return res.status(400).json({ message: "Invalid search type." });
    }

    const contacts = await Contact.find(query);

    const formattedContacts = contacts.map((contact) => ({
      ...contact.toObject(),
      bday: formatDateToDDMMYYYY(contact.bday),
    }));

    res.status(200).json(formattedContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
