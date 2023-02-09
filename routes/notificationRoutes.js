const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifictionController");
const FCM = require('fcm-node');

//client sendRequest
router.post('/clientrequest', notificationController.clientsendRequest)

//skillprovider sendRequest
router.post('/skrequest', notificationController.skillprovidersendRequest)

//sendNotification
router.post('/sendnotification', notificationController.sendNotification)

//acceptContract
router.post('/acceptrequest', notificationController.acceptContract)

//RejectContract
router.post('/rejectrequest', notificationController.rejectContract)

module.exports = router;