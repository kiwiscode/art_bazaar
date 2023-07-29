const express = require("express");
const Stripe = require("stripe");
const router = express.Router();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
router.use(express.json());
const Product = require("../models/Product.model");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

router.post(
  "/create-checkout-session",
  authenticateToken,
  async (request, response) => {
    const line_items = request.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
            metadata: {
              id: item._id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "TR", "DE"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            //       // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      // this can change on deploy version

      // when working on locally
      // success_url: "http://localhost:5173/checkout-success",
      // cancel_url: "http://localhost:5173/carts",

      // when working on deployment version
      success_url: "https://kiwiscode-canvas.netlify.app/checkout-success",
      cancel_url: "https://kiwiscode-canvas.netlify.app/carts",
    });

    response.send({ url: session.url });
  }
);

router.get("/checkout-success", authenticateToken, (request, response) => {
  const userId = request.user.userId;

  User.findById(userId)
    .select("-password")
    .populate("carts")
    .then((user) => {
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      const promises = user.carts.map((item) => {
        return Product.findById(item);
      });
      let orderArray;
      Promise.all(promises)
        .then((values) => {
          orderArray = values.map((value) => {
            return value;
          });
          User.findByIdAndUpdate(userId, { $push: { order: orderArray } })
            .then(() => {
              user.carts = [];
              user
                .save()
                .then(() => {
                  response.json({ order: orderArray });
                })
                .catch((error) => {
                  response.status(500).json({ error: "Internal Server Error" });
                });
            })
            .catch((error) => {
              response.status(500).json({ error: "Internal Server Error" });
            });
        })
        .catch((error) => {
          response.status(500).json({ error: "Internal Server Error" });
        });
    });
});

router.get("/orders", authenticateToken, (request, response) => {
  const { userId } = request.user;

  User.findById(userId)
    .then((user) => {
      const { order } = user;
      response.status(200).json({ order });
    })
    .catch((error) => {
      return error;
    });
});

module.exports = router;
