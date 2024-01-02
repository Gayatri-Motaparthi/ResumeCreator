function passwordHashing(password) {
    const sha256 = require('sha256');

    return sha256(String(password));
};


module.exports = { passwordHashing };

