const express = require("express");
const router = express.Router();

const session = require('express-session');
router.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
}));

var theme = "Light";

const { getChatResponse } = require("./response");

const UserDetails = require("./userDetails");
const { passwordHashing } = require("./hashing");

const jwt = require('jsonwebtoken');
const secretKey = passwordHashing("password");

const cookie = require('cookie');
const formatInput = require("./formatInput");

const {checkDates} = require("./checkDates")

const {sendMail} = require("./test")

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const pdf = require('html-pdf');



dotenv.config();


var template ;


router.get("/", function (req, res) {
    res.redirect("/homepage")
});

router.get("/homepage", function (req, res) {
    res.render("homepage",{theme});
});

router.get("/profile", function(req,res){
    res.render("profile", {theme})
});

router.post("/profile", function(req,res){
    var FullName = req.body.FullName
    var EmailID = req.body.EmailID

    
    var response = {};
    if (!EmailID.includes("@") || !EmailID.includes(".")) {
        response.error = "Invalid Email-ID!";
        res.json(response);
    } else {
        req.session.profile = {
        userName: FullName,
        emailID: EmailID
    }
    console.log(req.session.profile)
   
        response.success = true;
        res.json(response);
    }

    
});

router.get("/basics", function(req,res){
    res.render("basics", {theme})
});

router.post("/basics", function(req,res){

    req.session.basics = {
        city: req.body.City,
        country: req.body.Country,
        zip: req.body.ZIP,
        phoneNumber: req.body.PhoneNumber,
        background: req.body.background
    }; 
   

    let background  = (formatInput({info: req.session.basics.background}));
    req.session.basics.background = background
    console.log(req.session.basics)
    res.redirect("/skills")
});

router.get("/workHistory", function(req,res){
    req.session.experience = req.session.experience || [] ;
    res.render("workHistory", { theme, experiences : req.session.experience });
});

router.get("/addExperience", function(req,res){
    res.render("addExperience", {theme})
});

router.post("/addExperience", function (req, res) {
    try {
        var response = {}

        // Check if the checkbox is checked
        if (req.body.checkbox === 'on') {
            // If checked, save the data without date validation
            console.log(req.body.Achievements)
            const experiences = {
                jobTitle: req.body.JobTitle,
                employer: req.body.Employer,
                country: req.body.CountryExperience,
                state: req.body.State,
                city: req.body.City,
                startDate: { month: req.body.monthsSD, year: req.body.yearsSD },
                endDate: { month: "Present", year: "" },
                achievements: req.body.Achievements
            };

            let experience = (formatInput({ info: experiences.achievements }));
            experiences.achievements = experience;


            req.session.experience = req.session.experience || [];
            req.session.experience.push(experiences);
            console.log(req.session.experience);

            response.success = true;
            res.json(response);
        } else {
            // If not checked, proceed with date validation
            if (checkDates({ month: req.body.monthsSD, year: req.body.yearsSD }, { month: req.body.monthsED, year: req.body.yearsED })) {
                const endDate = { month: req.body.monthsED, year: req.body.yearsED };

                const experiences = {
                    jobTitle: req.body.JobTitle,
                    employer: req.body.Employer,
                    country: req.body.CountryExperience,
                    state: req.body.State,
                    city: req.body.City,
                    startDate: { month: req.body.monthsSD, year: req.body.yearsSD },
                    endDate: endDate,
                    achievements: req.body.Achievements
                };

                let experience = (formatInput({ info: experiences.achievements }));
                experiences.achievements = experience;
                
                req.session.experience = req.session.experience || [];
                req.session.experience.push(experiences);
                console.log(req.session.experience);

                response.success = true;
                res.json(response);
            } else {
                response.error = "Your end date can't be before the start date";
                res.json(response);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/educationHistory", function(req,res){
   req.session.education = req.session.education || "";
    res.render("educationHistory", {theme, educationList: req.session.education})
});

router.get("/addEducation", function(req,res){
   
    res.render("addEducation", {theme})
});

router.post("/addEducation", function(req, res){

    try{
        var response = {}

        if (checkDates({month: req.body.monthsSD, year: req.body.yearsSD}, {month: req.body.monthsED, year: req.body.yearsED})){
                
            req.session.education = req.session.education || [];

            if (req.body.checkbox === 'on') {
                    endDate = {month: req.body.monthsED, year:req.body.yearsED +" (Expected)"};
            }
            else{
                endDate = {month: req.body.monthsED, year: req.body.yearsED};
            }
            const educationList = {
                schoolName: req.body.SchoolName,
                degree: req.body.Degree,
                fieldOfStudy: req.body.FieldOfStudy,
                country: req.body.Country,
                city: req.body.City,
                startDate: { month: req.body.monthsSD, year: req.body.yearsSD },
                endDate: endDate,
                achievements: req.body.Achievements
            };

            let education  = (formatInput({info: educationList.achievements}));
            educationList.achievements =  education;

            req.session.education.push(educationList);
            console.log(req.session.education);

            response.success = true;
            res.json(response);
        }else{
                response.error = "Your end date can't be before the start date";
                res.json(response);
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
     
        

});

router.get("/download", function(req,res){
    res.render("download", {theme})
});

router.post("/download", function(req,res){
   res.redirect("/resumePDF")

});


router.get("/signup/:error?", function (req, res) {
    const error = req.params.error || "";
    res.render("signUp", { theme, errorMessage: error });

});

router.post("/signup", async function (req, res) {
    var name = req.body.name;
    var email = req.body.em;
    var password = req.body.p;
    var confirmPassword = req.body.cp;
   
    var response = {};
    if (!email.includes("@") || !email.includes(".")) {
        response.error = "Invalid Email-ID!";
        res.json(response);
    } else if (await UserDetails.checkIfUserExists(email)) {
        response.error = "Account already exists! ";
        res.json(response);
    } else if (! await UserDetails.checkIfPasswordsMatchSignUp(password, confirmPassword)) {
        response.error = "Passwords do not match! Try again ";
        res.json(response);
    } else {
         const user = await UserDetails.addUser(name, email, passwordHashing(password));

        const token = jwt.sign({ userId: user._id }, passwordHashing("password"), {
        expiresIn: '1h',});

        response.success = true;

        res.setHeader('Set-Cookie', cookie.serialize('Authorization', token, {
            httpOnly: true,
            maxAge: 60 *60, 
            path: '/', 

            sameSite: 'Strict', 
        }));

        res.json(response);
    }
    


});

router.get("/login/:error?", function (req, res) {
    const error = req.params.error || "";
    res.render("login", { theme, errorMessage: error });

});
//check for no input in signup and login
router.post("/login", async function (req, res) {

    var email = req.body.em;
    var password = req.body.p;
    var response = {};
    if (! await UserDetails.checkIfUserExists(email)) {

        response.error = "Account does not exist! ";
        res.json(response);

    } else if (! await UserDetails.checkIfCorrectPasswordLogIn(email, password)) {
        response.error = "Incorrect Password! Try again ";
        res.json(response);

    } else {

        const user = await UserDetails.getUserDetails()


        const token = jwt.sign({ userId: user._id }, passwordHashing("password"), {
        expiresIn: '1h',});

        response.success = true;

        res.setHeader('Set-Cookie', cookie.serialize('Authorization', token, {
            httpOnly: true,
            maxAge: 60* 60, 
            path: '/', 
         
            sameSite: 'Strict',
        }));

        res.json(response);
     }



});

router.get("/jobDescription", function (req, res) {
    
    res.render("jobDescription", { theme});

});

router.post("/jobDescription", function (req, res) {
    

    let jd  = (formatInput({info: req.body.jobDescription}));
    req.session.jobDescription = jd;

    console.log(req.session.jobDescription)
    res.redirect("/download")

});

router.get("/resumePDF", async function (req, res) {

    const cookies = cookie.parse(req.headers.cookie || '');

    // Check if the 'Authorization' cookie exists
    const token = cookies['Authorization'];

    if (!token) {
        console.log("No token found");
        return res.redirect("/signup");
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("Token found");

        req.user = decoded;
        var profile = req.session.profile || "";
        var basics = req.session.basics || "";
        var experiences = req.session.experience || "";
        var education = req.session.education || "";
        var skills = req.session.skills || "";

       
        res.render("resumeTemplate", { theme, profile, basics , experiences, education, skills , template});

        
    } catch (error) {
        return console.log(error)
    }
});


router.post("/resumePDF", function (req, res) {

    const resume = req.body.resume;
    console.log(resume);

    sendMail();

    var response = {};
    response.success = true;
    res.json(response)

});


router.get("/sendMail", async function (req, res) {

    var profile = req.session.profile || "";
        var basics = req.session.basics || "";
        var experiences = req.session.experience || "";
        var education = req.session.education || "";
        var skills = req.session.skills || "";

        res.render("resumeToMail", { theme, profile, basics , experiences, education, skills , template});
       

});

router.get("/mailSent", async function (req, res) {

    
        res.render("mailSent", { theme});
       

});


router.get("/downloadComplete", function (req, res) {
    
    res.render("downloadComplete", {theme});

});
router.get("/skills", function (req, res) {
    
    res.render("skills", { theme});

});

router.post("/skills", function (req, res) {

    let skills  = (formatInput({info: req.body.skills}));
    console.log(skills);
    var skillsArray = [];
    for (let i = 0; i < skills.length; i++){
        if (skills[i].includes(",")){
            skillsFormatted = skills[i].split(',').map(skill => skill.trim());
            for (let x = 0; x < skillsFormatted.length; x++){
            
                skillsArray.push(skillsFormatted[x])

            }
        }
        else{
            skillsArray.push(skills[i].trim())
        }
       
    }

    console.log(skillsArray)

    req.session.skills = { skills :skillsArray};
    console.log(req.session.skills);
    
    res.redirect("/workHistory");

});

router.get("/templates", function (req, res) {
    
    res.render("selectTemplates", { theme});

});

router.post("/templates", function (req, res) {
    template = req.body.template;

    res.redirect("/profile")

});


module.exports = router;
