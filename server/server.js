const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT;

app.listen(PORT, () => {
  // console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Server listening on ${PORT};
  `);
});

// Server listening on http://localhost:3000
// Ready for messages
// true
// Connected to Mongo! Database Online => DB name:"test"

// error
// Access to XMLHttpRequest at 'https://mern-ecommerce-app-j3gu.onrender.com/products' from origin 'https://regal-bubblegum-257fbb.netlify.app' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin
