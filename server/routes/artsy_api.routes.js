require("dotenv").config();
const request = require("superagent");
const router = require("express").Router();

const clientID = process.env.ARTSY_CLIENT_ID;
const clientSecret = process.env.ARTSY_CLIENT_SECRET;
const apiUrl = "https://api.artsy.net/api/tokens/xapp_token";
let artsyAppToken;

request
  .post(apiUrl)
  .send({
    client_id: clientID,
    client_secret: clientSecret,
  })
  .end(function (err, res) {
    if (err) {
      console.error("Error from Artsy API:", err);
      return;
    }
    artsyAppToken = res.body.token;

    console.log("token from artsy api:", artsyAppToken);
  });

router.get("/token", (req, res) => {
  res.json({ apiToken: artsyAppToken });
});

module.exports = router;
