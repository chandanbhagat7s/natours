const fs = require('fs');
const mongoose = require('mongoose');
// bringing the model for inserting the data into the database 
const Tour = require('./models/Tour');
const Reviews = require('./models/Review');
const User = require('./models/User');


// we will read the data from the file we have and insert into the database


mongoose.connect("mongodb://127.0.0.1:27017/newpratice", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("database connected");
    })
    .catch(err => {
        console.log("Could not connect", err);
    });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'))
const Users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8'))
const rev = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8'))

const insertdata = async () => {
    try {
        await Tour.create(tours)
        await User.create(Users)
        await Reviews.create(rev)
        console.log("data inserted sucesfully");
    } catch (err) {
        console.log(err);
        console.log("data not inserted okk ");
    }
    // to stop the process
    process.exit()
}

const deletedata = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Reviews.deleteMany()
        console.log("data deleted sucesfully");
    } catch (err) {
        console.log("data not inserted okk ");
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    insertdata()
} else if (process.argv[2] === '--delete') {
    deletedata()
}









