const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  `Server listening on ${PORT};
  `;
});
