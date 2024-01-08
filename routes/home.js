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

const { getChatResponse } = require("./response");


const UserDetails = require("./userDetails");
const { passwordHashing } = require("./hashing");

const jwt = require('jsonwebtoken');
const secretKey = passwordHashing("password");

const cookie = require('cookie');

const checkJWT = (req, res, next) => {
  const token = req.headers['Authorization'];
    // const token  = req.token;
    console.log(token);
  if (!token) {
    console.log("no token")
     res.redirect("/signup");
     return;
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("token")

    req.user = decoded;
    next();
    return res.redirect("/resumePDF")
  } catch (error) {
    return res.status(400).send('Invalid Token.');
  }
};


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
    res.redirect("/skills")
});

router.get("/workHistory", function(req,res){
    req.session.experience = req.session.experience || [] ;
    res.render("workHistory", { theme, experiences : req.session.experience });
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
   req.session.education = req.session.education || "";
    res.render("educationHistory", {theme, educationList: req.session.education})
});

router.get("/addEducation", function(req,res){
   
    res.render("addEducation", {theme})
});

router.post("/addEducation", function(req, res){
    req.session.education = req.session.education || [];

    const education = {
        schoolName: req.body.SchoolName,
        degree: req.body.Degree,
        fieldOfStudy: req.body.FieldOfStudy,
        country: req.body.Country,
        city: req.body.City,
        startDate: { month: req.body.monthsSD, year: req.body.yearsSD },
        endDate: { month: req.body.monthsED, year: req.body.yearsED },
        achievements: req.body.Achievements
    };

    req.session.education.push(education);
    console.log(req.session.education);
    
    res.render("educationHistory", { theme, educationList: req.session.education });
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
            maxAge: 60, // Max age in seconds, adjust as needed
            path: '/', // Path for which the cookie is valid
            // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
            sameSite: 'Strict', // Adjust as needed
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
        expiresIn: '1m',});

        response.success = true;

        res.setHeader('Set-Cookie', cookie.serialize('Authorization', token, {
            httpOnly: true,
            maxAge: 60, // Max age in seconds, adjust as needed
            path: '/', // Path for which the cookie is valid
            // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
            sameSite: 'Strict', // Adjust as needed
        }));

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

router.get("/resumePDF",  function (req, res) {

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
    var experience = req.session.experiences || "";
    var education = req.session.education || "";
    var skills = req.session.skills || "";
        res.render("modernProfessional", { theme, profile, basics , experience, education, skills});
    } catch (error) {
        return res.status(400).send('Invalid Token.');
    }
});
    // var profile = req.session.profile || "";
    // var basics = req.session.basics || "";
    // var experience = req.session.experiences || "";
    // var education = req.session.education || "";
    // var skills = req.session.skills || "";


    // res.render("modernProfessional", { theme, profile, basics , experience, education, skills});

// });

router.post("/resumePDF", function (req, res) {
    
    res.redirect("/resumePDF");

});

router.get("/skills", function (req, res) {
    
    res.render("skills", { theme});

});

router.post("/skills", function (req, res) {

    req.session.skills = { skills : req.body.skills };
    
    res.redirect("/workHistory");

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