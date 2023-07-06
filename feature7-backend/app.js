require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const {EMAIL,PASSWORD}=require('./env')

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.get('/',( req , res)=> {res.send("Welcome to the Gaurav Pipada Backend Server")})
app.post('/sendNote', async (req, res) => {
    const { email, note } = req.body;
    console.log(req.body) 
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: EMAIL,
          pass: PASSWORD
        }
      });

      let MailGenerator = new Mailgen({
        theme:"default",
        product:{
            name : "Gaurav Pipada",
            link : "https://mailgen.js"
        }
      })
  
      const mailOptions = {
        from: EMAIL ,
        to: email,
        subject: 'Note from Gaurav App',
        html: MailGenerator.generate({
          body: {
            name: 'Dear ' + email,
            intro: note,
            outro: 'Regards,\n Gaurav Pipada'
          }
        })
      };
  
      await transporter.sendMail(mailOptions);
      res.send('Note sent successfully');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error sending note' + error);
    }
  });
  
  


//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
