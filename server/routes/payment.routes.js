const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const Purchase = require("../models/Purchase.model");
const Product = require("../models/Product.model");
const SECRET_KEY =
  "sk_test_51NX7Y1AProtn5sKl33yyvrwhkG0UyP6sbiPJPJO4n5GOdsxrOdFXbQDtyPhNisvbpsYOCeL32GtLh8XYFYbzljt800UH0IhL0J";

const stripe = require("stripe")(SECRET_KEY);

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

// Helper function to get product data from the database
const getProductsData = async (products) => {
  const lineItems = [];

  for (const product of products) {
    const productData = await Product.findById(product._id);
    if (productData) {
      lineItems.push({
        price: productData.price,
        quantity: product.quantity,
        currency: "USD",
      });
    }
  }

  return lineItems;
};

router.get("/", authenticateToken, (req, res) => {
  res.render("payment");
});

router.post("/save-address", authenticateToken, (req, res) => {
  const { fullName, addressLine1, addressLine2, city, zipCode, country } =
    req.body;
  const userId = req.user.userId;

  if (!fullName || !addressLine1 || !city || !zipCode || !country) {
    return res.status(400).json({ message: "Eksik adres bilgileri!" });
  }

  const purchase = new Purchase({
    user: userId,
    address: {
      fullName,
      addressLine1,
      addressLine2,
      city,
      zipCode,
      country,
    },
    status: "pending",
  });

  purchase
    .save()
    .then(() => {
      res.json({ message: "Adres başarıyla kaydedildi!" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Adres kaydedilirken bir hata oluştu!" });
    });
});

router.post("/create-payment", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const products = req.body.products;

  try {
    // Get product data for payment request
    const productIds = products.map((product) => product._id); // Product id'leri alın
    const productsData = await Product.find({ _id: { $in: productIds } }); // Product id'leri ile Product verilerini bulun

    // Populate product field in products array with product data
    const populatedProducts = products.map((product, index) => ({
      ...product,
      product: productsData[index],
    }));

    // Calculate total price and update product and total price fields in products array
    populatedProducts.forEach((product) => {
      product.totalPrice = product.product.price * product.quantity; // Calculate total price for each product
    });

    // Create payment request with Stripe API
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Supported payment methods (e.g., card)
      line_items: populatedProducts.map((product) => ({
        quantity: product.quantity,
        currency: "USD",
      })), // Populated products array for one-time payments
      mode: "payment", // Payment type (one-time payment)
      success_url: `${API_URL}/success`, // URL to redirect if payment is successful
      cancel_url: `${API_URL}/cancel`, // URL to redirect if payment is cancelled
      customer_email: req.user.email, // User's email address (optional)
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Ödeme oluşturulurken bir hata oluştu!" });
  }
});

module.exports = router;
