const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/swift-hire';

let db = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db = mongoose.connection

db.once('open', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

module.exports = db;
