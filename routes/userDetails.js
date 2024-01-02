const db = require('../database/db');

var Users = require("../models/userSchema");

const { passwordHashing } = require("./hashing")

class UserDetails {

    static async getUserDetails() {
        try {
            const users = await Users.find({});
            return users;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async getUserName(email) {
        try {
            const users = await this.getUserDetails();

            for (let i = 0; i < users.length; i++) {
                if (email == users[i].email) {
                    return users[i].username;
                }
            }

            return "Anonymous";
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    static async checkIfUserExists(email) {
        try {
            const users = await this.getUserDetails();

            for (let i = 0; i < users.length; i++) {
                if (email == users[i].email) {
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async addUser(name, email, password) {
        try {
            const createUser = { "name": name, "email": email, "password": password };

            const newUser = new Users({
                username: name,
                email: email,
                password: password
            });
            await newUser.save();
            var userDetails = await this.getUserDetails();
            return userDetails;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static checkIfPasswordsMatchSignUp(password, confirmPassword) {
        if (passwordHashing(password) == passwordHashing(confirmPassword)) {
            return true;
        }
        return false;

    }

    static async checkIfCorrectPasswordLogIn(email, password) {
        try {
            const users = await this.getUserDetails();

            for (let i = 0; i < users.length; i++) {
                if (email == users[i].email) {
                    if (passwordHashing(password) == users[i].password) {
                        return true;
                    }
                }
            }
            return false;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}



module.exports = UserDetails;







