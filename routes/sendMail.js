const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const pdf = require('html-pdf');

 const puppeteer = require('puppeteer');

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "swifthireresume@gmail.com",
        pass: "xxxxx",
    },
});

async function sendMail() {
    try {
       
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:3000/sendMail'); 

    await page.waitForSelector('#resume', { timeout: 10000 });


    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });

   
  

        let mailOptions = {
            from: 'swifthireresume@gmail.com',
            to: 'useremail@gmail.com,
            subject: 'Here is Your Resume',
            text: 'Resume Has Been generated',
            html: '<b>Heres Your Resume</b>',
            attachments: [
        {
          filename: 'resume.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ], };
    

        console.log("Sending Email");
        await transporter.sendMail(mailOptions);

         console.log('Email sent successfully!');
    } catch (E) {
        console.log(E);
    }
}

// Example usage:
module.exports = {sendMail}
