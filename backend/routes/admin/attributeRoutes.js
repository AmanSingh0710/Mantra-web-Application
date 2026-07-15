const express = require("express");
const router = express.Router();
const attributeController = require("../../controllers/admin/attributeController");
const auth =  require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");


router.get("/", auth, isAdmin("ADMIN"), attributeController.getAttributes);          
router.post("/", auth, isAdmin("ADMIN"), attributeController.createAttribute);      
router.put("/:id", auth, isAdmin("ADMIN"), attributeController.updateAttribute);    
router.delete("/:id", auth, isAdmin("ADMIN"), attributeController.deleteAttribute);  

module.exports = router;