const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_EMAIL_KEY);

const sendEmail = (email, message, headers) => { 
   
    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL_SENDER,
      subject: headers,
      text: message,

    };
    sgMail.send(msg)
    .then(() => {
        console.log("Email sent")
    })
    .catch((error) => {
        console.error(error)
    })

}

module.exports = {
    sendEmail
}