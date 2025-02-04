const express = require("express");
const router = express.Router();
const formController = require("../controller/formController");

router.post("/", formController.saveForm);
router.get("/form-names", formController.getFormNames);
router.get("/:id", formController.getFormSchemaById);

module.exports = router;
