const express = require("express");
const router = express.Router();
const session = require('express-session');

router.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
}));



const path = require("path");

var theme = "Light";

const { getChatResponse } = require("./axios");


const UserDetails = require("./userDetails");
const { passwordHashing } = require("./hashing");

router.get("/", function (req, res) {

    res.redirect("/homepage");

});

router.get("/homepage", function (req, res) {
    res.render("homepage",{theme});
});

router.get("/profile", function(req,res){
    res.render("profile", {theme})
});

router.post("/profile", function(req,res){
    req.session.profile = {
        userName: req.body.FullName,
        emailID: req.body.EmailID
    }; 
    res.redirect("/basics")
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
    res.redirect("/workHistory")
});

router.get("/workHistory", function(req,res){
    req.session.experience = req.session.experience || [] ;
    console.log(req.session.experience);
   var experiences = req.session.experience;
    res.render("workHistory", { theme,experiences : req.session.experience });
});

router.get("/addExperience", function(req,res){
    res.render("addExperience", {theme})
});

router.post("/addExperience", function(req,res){
     req.session.experience = req.session.experience || [];

    const experience = {
        jobTitle : req.body.JobTitle,
        employer: req.body.Employer,
        country: req.body.CountryExperience,
        state: req.body.State,
        city: req.body.City,
        startDate: {month: req.body.monthsSD, year: req.body.yearsSD},
        endDate: {month: req.body.monthsED, year: req.body.yearsED},
        achievements: req.body.Achievements

    };

    req.session.experience.push(experience);
    console.log(req.session.experience);
    res.render("workHistory", {theme , experiences: req.session.experience})
});

router.get("/educationHistory", function(req,res){
    res.render("educationHistory", {theme})
});

router.get("/addEducation", function(req,res){
    res.render("addEducation", {theme})
});

router.post("/addEducation", function(req,res){
    req.session.education = {
        schoolName : req.body.SchoolName,
        degree: req.body.Degree,
        fieldOfStudy: req.body.FieldOfStudy,
        country: req.body.Country,
        city: req.body.City,
        startDate: {month: req.body.monthsSD, year: req.body.yearsSD},
        endDate: {month: req.body.monthsED, year: req.body.yearsED},
        achievements: req.body.Achievements

    };
    console.log(req.session.education);
    res.redirect("/educationHistory");
});

router.get("/download", function(req,res){
    res.render("download", {theme})
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
    console.log("in signup post")

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
        await UserDetails.addUser(name, email, passwordHashing(password))
        userName = name;
        response.success = true;
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
        userName = await UserDetails.getUserName(email);
        response.success = true;
        res.json(response);
    }



});

router.get("/jobDescription", function (req, res) {
    
    res.render("jobDescription", { theme});

});

router.post("/jobDescription", function (req, res) {
    
    req.session.jobDescription = { jobDescription : req.body.jobDescription}
    console.log(req.session.jobDescription)
    res.redirect("/download")

});

router.get("/resumePDF", function (req, res) {
    
    res.render("resumePDF", { theme});

});

router.post("/resumePDF", function (req, res) {
    
    res.render("resumePDF", { theme});

});

/*
router.post("/homepage", async function (req, res) {
    var question = req.body.inputbar;
    questions.push(question);

    try {
        var response = await getChatResponse(question);
        var content = response.data
        answers.push(content);

        res.render("homepage", { theme, questions, answers });
    } catch (error) {
        console.error(error);
    }
});


router.get("/logout", async function (req, res) {
    res.redirect("/")
});


*/
module.exports = router;