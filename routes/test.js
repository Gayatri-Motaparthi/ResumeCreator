const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require("path");
const EmailTemplates = require('email-templates');
// var smtpTransport = require('nodemailer-smtp-transport');
//  const puppeteer = require('puppeteer');

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "swifthireresume@gmail.com",
        pass: "ouea dleg ovjt espr",
    },
});

async function sendMail() {
   var templateDir = path.join(__dirname, "../", 'views', 'resumeTemplate')
  console.log(templateDir);
    const testMailTemplate = new EmailTemplates({ views: { root: templateDir } });
      
    var locals = {
        userName: "Gayatri" //dynamic data for bind into the template
    };


   testMailTemplate.render(locals, function (err, temp) {
        if (err) {
            console.log("error", err);
   
        } else {

        console.log("Sending Email");
        transporter.sendMail({from: 'swifthireresume@gmail.com',
            to: 'gayatri.motaparthi@gmail.com',
            subject: 'test',
             text: temp.text,
        html:  temp.html});

         console.log('Email sent successfully!');
        }
})
}

// Example usage:
module.exports = {sendMail}
