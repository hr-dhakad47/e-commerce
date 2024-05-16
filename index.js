const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

let app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
"mongodb+srv://hrd7388:hrd7388@cluster0.skvdycb.mongodb.net/?retryWrites=true&w=majority&appName=cluster0")
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

let productsTable = mongoose.model("products", {
  id: Number,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
});

app.get("/productsList", async function (req, res) {
  let products = await productsTable.find({});
  res.json(products);
});

app.get("/productsList/:productId", async function (req, res) {
  const productId = req.params.productId;
  let products = await productsTable.findById(productId);
  res.json(products);
});

app.post("/addProducts", function (req, res) {
  let products = new productsTable(req.body);
  let saveData = products.save().then((data) => {
    res.json(data);
  });
});

app.delete("/deleteProduct/:productId", async function (req, res) {
  const productId = req.params.productId;

  try {
    const deletedProduct = await productsTable.findByIdAndDelete(productId);

    if (deletedProduct) {
      res.status(200).json({
        message: 'Product deleted successfully',
        status: 200,
      });
    } else {
      res.status(404).json({
        message: 'Product not found',
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message,
    });
  }
});

app.put("/updateProduct/:productId", async function (req, res) {
  const productId = req.params.productId;

  try {
    const updateProduct = await productsTable.findByIdAndUpdate(productId,req.body);

    if (updateProduct) {
      res.status(200).json({
        message: 'Product updated successfully',
        status: 200,
      });
    } else {
      res.status(404).json({
        message: 'Product not found',
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message,
    });
  }
});

app.listen(3001, (err) => {
  if (err) {
    console.log("Server not running");
  } else {
    console.log("Server running on port 3001");
  }
});
