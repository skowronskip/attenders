const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ntife17@gmail.com',
        pass: 'ntife123'
    }
});

module.exports = transporter;