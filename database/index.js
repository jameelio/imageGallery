const mongoose = require("mongoose");

const customConnectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true
}

if (process.env.NODE_ENV === "dev") mongoose.set("debug", true);
mongoose.Promise = Promise;


module.exports = {
    connectDB:async (dbConnectionString) => {
        try {
            console.log("Initializing connection ...");
            mongoose.connect(dbConnectionString, customConnectOptions)
            mongoose.connection.on("error",console.error.bind(console, "connection error:"))
            mongoose.connection.once("open",async()=>{
                console.log("[MONGOOSE CONNECTED]")
            })
        } catch (error) {
            console.log("ERROR CONNECTING MONGOOSE",error);
        }
    }
}

