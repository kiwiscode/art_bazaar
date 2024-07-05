const mongoose = require("mongoose");

const MONGO_URI =
  // when working on deployment version
<<<<<<< HEAD
  process.env.MONGODB_URI;
// when working on locally
// "mongodb://127.0.0.1:27017/my-fullstack-project";
=======
  // process.env.MONGODB_URI;
  // when working on locally
  "mongodb://127.0.0.1:27017/Art-Bazaar";
>>>>>>> c555ca2 (Refactor e-commerce project to new concept)

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
