const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const Contract = require("../models/contract.model");
const { response } = require("express");
const FCM = require('fcm-node');
const env = require("dotenv").config();


const fcm = new FCM(process.env.server_key);

//Send request + notification saveing (client to sk provider)
const clientsendRequest = async (req, res) => {
   try {

      const sender = await User.findOne({ _id: req.body.senderid });
      const contract = await Contract.findOne({ _id: req.body.contractid });

      if (!sender) { return res.status(404).send({ error: 'Sender not found' }); }

      // sender has contractor needs ? 
      if (sender.userstatus == "block") { return res.status(401).send({ error: 'Sender is blocked' }); }

      // get userid from contract
      let body = {}
      body["reciverid"] = contract.userid;
      body["title"] = "CRAFT";
      body["body"] = `${sender.firstname} wants to hire you as a ${contract.category}`;
      sendNotification(req, res, body);
      //sendNotification(req)
      //send uper values to sendNotification
   } catch {

   }
}

//Send request + notification saveing (sk provider to client)
const skillprovidersendRequest = async (req, res) => {
   try {

      const sender = await User.findOne({ _id: req.body.senderid });
      const contract = await Contract.findOne({ _id: req.body.contractid });

      if (!sender) { return res.status(404).send({ error: 'Sender not found' }); }
      if (!contract) { return res.status(404).send({ error: 'Contract not found' }); }

      // sender has contractor needs ? 
      //if (!sender.skill.includes(contract.category)) { return res.status(401).send({ error: 'Sender is not eligible' }); }
      if (sender.userstatus == "block") { return res.status(401).send({ error: 'Sender is blocked' }); }

      // get userid from contract
      let body = {}
      body["reciverid"] = contract.userid;
      body["title"] = "CRAFT";
      body["body"] = `${sender.firstname} wants to work for you as a ${contract.category}`;
      sendNotification(req, res, body);
      //sendNotification(req)
      //send uper values to sendNotification
   } catch {

   }
}

//accept request

//send fcm notification module
const sendNotification = async (req, res, body) => {
   try {
      //console.log(req);
      const reciverid = await (!req.body.reciverid ? (body.reciverid) : (req.body.reciverid))
      //console.log(reciverid)
      const reciver = await User.findOne({ _id: reciverid });
      if (!reciver) {
         return res.status(404).send({ error: 'User not found' });
      }
      if (!reciver.DeviceToken) {
         return res.status(404).send({ error: 'User not LOGIN' });
      }
      const deviceToken = reciver.DeviceToken;

      const title = await (!req.body.title ? (body.title) : (req.body.title))
      const notificationBody = await (!req.body.body ? (body.body) : (req.body.body))

      // console.log(deviceToken);
      const message = {
         to: deviceToken,
         notification: {
            title: title,
            body: notificationBody,
         },
         // data: {
         //    meassage: user
         // }
      };
      const messageIndex = reciver.notification.findIndex(notif => (
         notif.title === message.notification.title && notif.body === message.notification.body
      ));

      if (messageIndex !== -1) {
         reciver.notification.splice(messageIndex, 1);
      }

      reciver.notification.push(message.notification);

      reciver.save();
      await fcm.send(message, (err, response) => {
         if (err) { console.log(err) }
      });

      res.status(200).send({ message: 'Notification sent successfully ' })

   } catch (error) {
      return res.status(400).send({ error: 'Something went wrong: ' + error });
   }
};

module.exports = {
   sendNotification,
   clientsendRequest,
   skillprovidersendRequest,

};



