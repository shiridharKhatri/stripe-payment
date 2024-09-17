// server.js

const express = require("express");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51N9PpqHN8gClun861RjS82tcJkSb4ehkrUPK2bqwNXhucyjCCesEsxo71G8WfnyeDjUxdiA1oWuJctxmWnloPZtc007SmCNqSo"
);

const app = express();
const PORT = 3000;
app.use(express.json());
app.post("/create-payment-intent", async (req, res) => {


  try {
    let proDet = req.body.product.map((prod) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: prod.name,
          images: [prod.image],
        },
        unit_amount: Math.round(prod.price * 100),
      },
      quantity: prod.quantity,
    }));
    const sesson = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: proDet,
      mode: "payment",
      success_url: "http://localhost:3000/success", 
      cancel_url: "http://localhost:3000/cancel", 
    });
    res.json({ id: sesson.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.use(express.static(path.join(__dirname, "./", "index.html")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
