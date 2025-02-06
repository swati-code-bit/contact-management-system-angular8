const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  searchContacts,
  createDynamicContact
} = require("../controller/contactController");

router.post("/", createContact);
router.post("/add-dynamic-contact/",createDynamicContact)
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.post("/search", searchContacts);

module.exports = router;
