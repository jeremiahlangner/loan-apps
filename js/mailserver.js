/* mailserver; will like host on heroku to see if I can serve a high volume of emails for much cheaper. */
var nodemailer = require("nodemailer");

const SMTPServer = require('smtp-server').SMTPServer;
const server = new SMTPServer({
    logger: true,
    onData(stream, session, callback){
        stream.pipe(process.stdout); // print message to console
        stream.on('end', callback);
    },
});
server.listen(587);

// const server = new SMTPServer({
//     secure: false
// });
// server.listen(587);

let smtpConfig = {
    port: 587,
    secure: false // upgrade later with STARTTLS
};

var transport = nodemailer.createTransport(smtpConfig);
// var directTransport = require('nodemailer-direct-transport');

// var transport = nodemailer.createTransport(directTransport({
//     name: '', // should be the hostname machine IP address resolves to 
//     debug: true
// }));

transport.sendMail({
    to: 'fifthofeight@yahoo.com',
    from: 'no-reply@jeremiahlangner.com',
    subject: 'We should try for lunch.',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
    }, function(err){
    if(err){
        console.log(err);
        // check if htmlstream is still open and close it to clean up
    } else console.log(info);
});