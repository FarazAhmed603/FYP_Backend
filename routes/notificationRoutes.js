const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifictionController");
const FCM = require('fcm-node');


router.post('/send', notificationController.send)

module.exports = router;