const nodemailer = require('nodemailer');


/*  service:'Gmail',
    auth:{
        user:process.env.EMAIL_USERNAME ,
        password: process.env.EMAIL_PASSWORD 
    }
    // activate in gmail "last secure app " option*/
const sendEmail = async (options) => {
    // create a transponder : just the service that will send the email , its not the node who will send the email
    // we can use services : but now we will use devlopment(mailtrap)
    // console.log(options);
    const transponder = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }




    })

    // define the email options  from to
    const mailOprtions = {
        // name address
        from: 'chandanbagat@gmail.com <admin@gmail.com>',
        // receptionist address(which is coming as argument to function)
        to: options.email,
        subject: options.subject,
        text: options.text
        // html (we can send html also)
    }

    // actually send the email
    await transponder.sendMail(mailOprtions)
    //



}

module.exports = sendEmail;


