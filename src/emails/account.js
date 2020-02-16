const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) =>{
    sendgrid.send({
        from : 'hardik.p.111@gmail.com',
        to : email,
        subject : 'Thanks For Joining In...',
        text : `Welcome to the app, ${name}, Let me know how you get along with the app.`
    });
};

const sendLastEmail = (email,name) =>{  
    sendgrid.send({
        from : 'hardik.p.111@gmail.com',
        to : email,
        subject : 'Sorry To see you go !',
        text : `GoodBye, ${name}, Hope you have enjoyed our services.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendLastEmail
}