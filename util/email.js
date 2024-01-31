const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// creating class for sending email
module.exports = class emailsender {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Chandan bhagat ${process.env.EMAIL_FROM} `
    }
    // creat transporder
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,

            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }


    // method to send emails w,r,t templet and subject 
    // welcome,resetpass...ok 
    async send(templet, subject) {
        // send the actual function 
        //render html for email with pug templet 
        const html = pug.renderFile(`${__dirname}/../views/${templet}.pug`, {
            // sending some data to templet
            firstName: this.firstName,
            url: this.url,
            subject
        })
        // define the email options 
        // define the email options  from to
        const mailOprtions = {
            // name address
            from: this.from,
            // receptionist address(which is coming as argument to function)
            to: this.to,
            subject,
            html,
            // converting html to ttext by html-to -text
            text: htmlToText.convert(html)
            // html (we can send html also)
        }

        // create a transpode and send email
        await this.newTransport().sendMail(mailOprtions)
    }


    // 
    async sendWelcome() {
        await this.send('welcome', 'welcome to the natours family')
    }

}


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
        from: `chandanbagat@gmail.com ${process.env.EMAIL_FROM}`,
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

// module.exports = sendEmail;


