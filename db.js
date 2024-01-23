const mongoose = require("mongoose");

const DataBase = async () => {
    try {
        await mongoose.connect(process.env.mongoURL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB not connected");
    }
}

module.exports = DataBase