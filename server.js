const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
/*  we can get the environment in which we work 
 console.log(app.get('env'));   development

 we can create our environment varible by cammand line
 node_env=devlopment x=23 nodemon server.js

 doing this way we can do with creating configiration file
 --> npm i dotenv
 require it use it
 */

// this will red our env.. varibles okk 
dotenv.config({ path: './config.env' })
console.log(app.get('env'));
//  npm install -g win-node-env 
//npm run start:prod    // then the envirinment will be switched 
// console.log(process.env);


// database connection 
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

//removed made the new file model and implemented their schema and document (models work) in controllers okk 
/* // now we will create the schema : for validation, format of data to be entred , provid default value
const tourSchema = new mongoose.Schema({
// name:String,
// rating:Number,
// price:Number
name: {
    type: String,
    required: [true, "The Tour must have a name "],
    unique: true,

},
rating: {
    type: Number,
    default: 4.5 // default
},
price: {
    type: Number,
    required: [true, "The Tour must have a price"] // value,error
}

})

// now we nedd to create the model:for performing the crud , aggragition,operations and query
// variable_to_be_dec_inNODE = mongoose.model(name_fo_model,schema)
const Tour = mongoose.model('Tour', tourSchema);

// we will create new instance 
const data = new Tour({
name: "mumbau",
price: 34567

})

data.save().then((doc) => {
console.log(doc);
}).catch(err => {
console.log(err);
})*/

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server started at port ", port);
})