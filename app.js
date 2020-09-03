
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.render("home");
});

app.post("/contact", function(req, res){
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: {
    name: "Phoebe Dowling",
    address: process.env.OUTLOOK_USER
    }, // This is ignored by Gmail
    to: process.env.USER2,
    subject: 'New message from contact form',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.render('failure') // Show a page indicating failure
    }
    else {
      res.render('success') // Show a page indicating success
    }
  });
});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});





// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   sgMail.send(msg);
