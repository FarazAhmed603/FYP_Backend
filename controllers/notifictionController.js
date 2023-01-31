const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const contract = require("../models/contract.model");
const { response } = require("express");
const FCM = require('fcm-node');
const env = require("dotenv").config();


const fcm = new FCM(process.env.server_key);


const send = async (req, res) => {
   let a = "fcMDK-MoTBmBxNsUcpMU8w:" + req.body.token;
   console.log(a);
   var message = {
      to: a,
      notification: {
         title: req.body.title,
         body: req.body.body,
      },

      // data: { //you can send only notification or only data(or include both)
      //    title: 'ok cdfsdsdfsd',
      //    body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
      // }

   };
   fcm.send(message, function (err, response) {
      if (err) {
         return res.status(400).send('Something has gone wrong! ' + res.err + err
         );
      } else {
         // showToast("Successfully sent with response");
         return res.status(200).send(
            'all set send! ' + res + response
         );
      }
   });
}
module.exports = {
   send
};