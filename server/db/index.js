// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  // when working on deployment version
  process.env.MONGODB_URI;
// when working on locally
// "mongodb://127.0.0.1:27017/my-fullstack-project";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(
      `Connected to Mongo! Database Online => DB name:"${databaseName}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
