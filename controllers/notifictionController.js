const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const Contract = require("../models/contract.model");
const { response } = require("express");
//const FCM = require('fcm-node');
const env = require("dotenv").config();


var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREDB_key);

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://fus-craft-19403-default-rtdb.firebaseio.com"
});

//const fcm = new FCM(process.env.server_key);


//send notification (REQUSET) module
const sendNotification = async (req, res, body) => {
   try {
      //console.log(req);
      const reciverid = await (!req.body.reciverid ? (body.reciverid) : (req.body.reciverid))
      //console.log(reciverid)
      const reciver = await User.findOne({ _id: reciverid });
      if (!reciver) { return res.status(404).send({ error: 'User not found' }); }

      const deviceToken = reciver.DeviceToken;
      // console.log(deviceToken);
      const contractid = await (!req.body.contractid ? (body.contractid) : (req.body.contractid))
      const senderid = await (!req.body.senderid ? (body.senderid) : (req.body.senderid))
      const title = await (!req.body.title ? (body.title) : (req.body.title))
      const notificationBody = await (!req.body.body ? (body.body) : (req.body.body))
      const noti = {
         title: title,
         body: notificationBody,
         contractid: contractid,
         senderid: senderid,
         location: body.location,
      }
      //console.log(noti)
      const messageIndex = reciver.notification.findIndex(notif => (
         notif.title === title && notif.body === notificationBody && notif.senderid == senderid && notif.contractid == contractid));
      if (messageIndex !== -1) { reciver.notification.splice(messageIndex, 1); }
      reciver.notification.push(noti);
      reciver.save();

      if (deviceToken) {
         admin.messaging().send({
            token: deviceToken,
            data: {
               customData: "CRAFT",
               id: "2",
               ad: "Usama",
            },
            android: {
               notification: {
                  body: notificationBody,
                  title: title,
                  priority: "high",
                  sound: "default",
               },
            }
         }).catch((err) => {
            console.log('error in messaging:  ', err)
         })
      }
      res.status(200).send({ message: 'Notification sent successfully ' })
   } catch (error) {
      return res.status(400).send({ error: 'Something went wrong @Requesting🤬: ' + error });
   }
};

//Send request (client to sk provider)
const clientsendRequest = async (req, res) => {
   try {

      const sender = await User.findOne({ _id: req.body.senderid });
      const contract = await Contract.findOne({ _id: req.body.contractid });

      if (!sender) { return res.status(404).send({ error: 'Sender not found' }); }
      if (sender.userstatus == "block") { return res.status(401).send({ error: 'Sender is blocked' }); }

      let body = {}
      body["reciverid"] = contract.userid;
      body["title"] = `Request`;
      body["body"] = `${sender.firstname} wants to hire you as a ${contract.category}`;
      body["senderid"] = req.body.senderid;
      body["location"] = contract.location;
      body["contractid"] = req.body.contractid;
      sendNotification(req, res, body);

   } catch (err) {
      res.status(400).send(
         { error: 'Internal Server Error: ' + err }
      );
   }
}

//Send request + notification saveing (sk provider to client)
const skillprovidersendRequest = async (req, res) => {
   try {

      const sender = await User.findOne({ _id: req.body.senderid });
      const contract = await Contract.findOne({ _id: req.body.contractid });

      if (!sender) { return res.status(404).send({ error: 'Sender not found' }); }
      if (!contract) { return res.status(404).send({ error: 'Contract not found' }); }

      //if (!sender.skill.includes(contract.category)) { return res.status(401).send({ error: 'Sender is not eligible' }); }
      if (sender.userstatus == "block") { return res.status(401).send({ error: 'Sender is blocked' }); }

      let body = {}
      body["reciverid"] = contract.userid;
      body["title"] = `Request`;
      body["body"] = `${sender.firstname} wants to work for you as a ${contract.category}`;
      body["senderid"] = req.body.senderid;
      body["location"] = contract.location;
      body["contractid"] = req.body.contractid;
      sendNotification(req, res, body);
   } catch (err) {
      res.status(400).send(
         { error: 'Internal Server Error: ' + err }
      );
   }
}

//send notification (ACCEPT) module
const acceptContract = async (req, res) => { // body parameters (id's of {notification}, {contract}, {requesty})
   try {
      const contract = await Contract.findOne({ _id: req.body.contractid })
      const accepter = await User.findOne({ _id: contract.userid })
      const requesty = await User.findOne({ _id: req.body.requestyid });

      if (!contract || !accepter || !requesty) { return res.status(404).send({ error: 'Incomplete credentials' }); }

      //Find notification
      const messageIndex = accepter.notification.findIndex(notif => (notif._id == req.body.id));

      const Dtoken = requesty.DeviceToken;
      const noti = {
         title: "Request accepted🥳",
         body: `${accepter.firstname} has accepted your request for skill (${contract.category})`,
         location: contract.location
      };

      accepter.notification[messageIndex].status = "Accepted";
      await accepter.save();


      const messageIndex1 = requesty.notification.findIndex(notif => (
         notif.title === noti.title && notif.body === noti.body));
      if (messageIndex1 !== -1) { requesty.notification.splice(messageIndex1, 1); }
      requesty.notification.push(noti);
      await requesty.save();

      contract.workerid = requesty._id
      await contract.save();

      if (Dtoken) {
         admin.messaging().send({
            token: Dtoken,
            data: {
               customData: "CRAFT",
               id: "2",
               ad: "Usama Idrees",
            },
            android: {
               notification: {
                  body: noti.body,
                  title: noti.title,
                  priority: "high",
                  sound: "default",
               },
            }
         }).catch((err) => {
            console.log('error in messaging:  ', err)
         })
      }
      return res.status(200).send({ message: 'Notification sent successfully ' })
   } catch (error) {

      return res.status(400).send({
         error: 'Something went wrong @accepting: ' + error
      });
   }
}

//send notification (Rejected) module
const rejectContract = async (req, res) => { // body parameters (id's of {notification}, {contract}, {requesty})
   try {
      const contract = await Contract.findOne({ _id: req.body.contractid })
      const accepter = await User.findOne({ _id: contract.userid })
      const requesty = await User.findOne({ _id: req.body.requestyid });

      if (!contract || !accepter || !requesty) { return res.status(404).send({ error: 'Incomplete credentials' }); }

      //Find notification
      const messageIndex = accepter.notification.findIndex(notif => (notif._id == req.body.id));

      const Dtoken = requesty.DeviceToken;
      const noti = {
         title: "Request Rejected😕",
         body: `${accepter.firstname} has rejected your request for skill (${contract.category})`,
         location: contract.location
      };

      accepter.notification[messageIndex].status = "Recjected";
      await accepter.save();


      const messageIndex1 = requesty.notification.findIndex(notif => (
         notif.title === noti.title && notif.body === noti.body));
      if (messageIndex1 !== -1) { requesty.notification.splice(messageIndex1, 1); }
      requesty.notification.push(noti);
      await requesty.save();

      if (Dtoken) {
         admin.messaging().send({
            token: Dtoken,
            data: {
               customData: "CRAFT",
               id: "2",
               ad: "Usama Idrees",
            },
            android: {
               notification: {
                  body: noti.body,
                  title: noti.title,
                  priority: "high",
                  sound: "default",
               },
            }
         }).catch((err) => {
            console.log('error in messaging:  ', err)
         })
      }
      return res.status(200).send({ message: 'Notification sent successfully ' })
   } catch (error) {

      return res.status(400).send({
         error: 'Something went wrong @Rejecting: ' + error
      });
   }
}
module.exports = {
   sendNotification,
   clientsendRequest,
   skillprovidersendRequest,
   acceptContract,
   rejectContract,
};



