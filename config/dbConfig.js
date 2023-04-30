const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://jgibb2:MeMxokvPJNfSieKO@finalproject.ausnkd6.mongodb.net/?retryWrites=true&w=majority",
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (err){
        console.log(err);
    }
}

module.exports = connectDB;