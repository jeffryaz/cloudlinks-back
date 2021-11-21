const configMailer = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'mrjarcreator@gmail.com',
        pass: 'rosman123123'
    }
};

const configFrom = "mrjarcreator@gmail.com";

module.exports = { configMailer, configFrom };