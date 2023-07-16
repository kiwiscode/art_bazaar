// bin/seeds.js

const mongoose = require("mongoose");
const Product = require("../models/Product.model");

const MONGO_URI = process.env.MONGODB_URI;
// process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my-fullstack-project";

let fakeStoreProducts = [];

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        fakeStoreProducts = json;

        for (let index = 0; index < fakeStoreProducts.length; index++) {
          let fkProduct = fakeStoreProducts[index];

          let { id, title, price, description, category, image, rating } =
            fkProduct;

          rating = Math.floor(Math.random() * 5) + 1;
          let quantity = Math.floor(Math.random() * 500) + 1;

          Product.create({
            title,
            description,
            price,
            category,
            rating,
            image,
            quantity,
          });
        }

        return fakeStoreProducts;
      })
      .then((productsFromDB) => {
        console.log(`Created ${productsFromDB.length} products`);
      });
  })
  .then(() => {
    // Once the DB connection is closed, print a message
    console.log("DB connection closed!");
  })
  .catch((err) => {
    console.log(
      `An error occurred while creating products from the DB: ${err}`
    );
  });
