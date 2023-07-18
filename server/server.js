const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT};
  `);
});

// deploy version error
// Access to XMLHttpRequest at 'https://mern-ecommerce-app-j3gu.onrender.com/products' from origin 'https://chimerical-boba-692180.netlify.app' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://chimerical-boba-692180.netlify.app/' that is not equal to the supplied origin.

// local version error
// Access to XMLHttpRequest at 'https://mern-ecommerce-app-j3gu.onrender.com/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'https://chimerical-boba-692180.netlify.app/' that is not equal to the supplied origin.
