const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const express = require("express");
const Order = require("../models/Order.model");
const Artwork = require("../models/Artwork.model");

let allDeliveryDataFromSession;

router.post(
  "/artworks/:artworkId/collectors/:collectorId/purchase",
  async (req, res) => {
    try {
      const { allDeliveryData } = req.body;
      const { collectorId } = req.params;

      "req.body:", req.body;

      allDeliveryDataFromSession = { collectorId, allDeliveryData };

      "before session data:", allDeliveryDataFromSession;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: allDeliveryData.artworkToPurchase.title,
                images: [allDeliveryData.artworkToPurchase.imageUrl],
              },
              unit_amount: 1,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/settings/purchases`,
        cancel_url: `${req.headers.origin}`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "DE"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 500, currency: "usd" },
              display_name: "Standard shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
      });

      res.send({ url: session.url });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/stripe-webhook", express.json(), async (request, response) => {
  try {
    const event = request.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        "payment successfull";
        "success delivery data:", allDeliveryDataFromSession;

        "collector id:", allDeliveryDataFromSession.collectorId;
        "artwork id:",
          allDeliveryDataFromSession.allDeliveryData.artworkToPurchase._id;
        "shipping address:",
          allDeliveryDataFromSession.allDeliveryData.shippingAddress;

        await Order.create({
          collectorId: allDeliveryDataFromSession.collectorId,
          artworkToPurchase:
            allDeliveryDataFromSession.allDeliveryData.artworkToPurchase._id,
          allDeliveryData: {
            shippingAddress:
              allDeliveryDataFromSession.allDeliveryData.shippingAddress,
            paymentInfo: "",
          },
          status: "CONFIRMED",
        });

        await Artwork.findByIdAndUpdate(
          allDeliveryDataFromSession.allDeliveryData.artworkToPurchase._id,
          { is_sold: true }
        );

        "Order saved successfully";

        setTimeout(() => {
          allDeliveryDataFromSession = undefined;
        }, 1000);

        response.status(200).json({
          message: {
            success: true,
            message: "Subscription process completed successfully. Thank you!",
          },
        });
        break;
      case "payment_intent.payment_failed":
        "payment failed";

        response.status(400).json({
          message: {
            success: false,
            message: "Subscription process could not be completed. -1",
          },
        });

        break;
      default:
        "default delivery data:", allDeliveryDataFromSession;

        setTimeout(() => {
          allDeliveryDataFromSession = undefined;
        }, 1000);

        `Unhandled event type ${event.type}`;
    }
    response.status(200).end();
  } catch (error) {
    "error delivery data:", allDeliveryDataFromSession;

    setTimeout(() => {
      allDeliveryDataFromSession = undefined;
    }, 1000);

    ("Subscription process could not be completed. -1");
    response.status(500).json({
      errorMessage:
        "An error occurred. Subscription process could not be completed. -1",
    });
  }
});

module.exports = router;
