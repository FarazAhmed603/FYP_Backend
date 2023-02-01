const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifictionController");
const FCM = require('fcm-node');

//client sendRequest
router.post('/clientrequest', notificationController.clientsendRequest)

//sendNotification
router.post('/sendnotification', notificationController.sendNotification)


//skillprovider sendRequest
router.post('/skrequest', notificationController.skillprovidersendRequest)


module.exports = router;