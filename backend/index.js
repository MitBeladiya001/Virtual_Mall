const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// automatically pass request through json
app.use(express.json());
// connect to port
app.use(cors());

// Database Connection With MongoDB
mongoose.connect(
  "mongodb+srv://magicearth10:iamdiscoDancer@cluster0.asbvz3y.mongodb.net/e-commerce"
);

//  API Creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// multer.diskStorage():

// multer.diskStorage() is a method provided by the multer library that creates a storage engine using the disk storage method.
// destination Property:

// The destination property specifies the directory where the uploaded files will be stored on the server's disk. In this case, it is set to "./upload/images". This means that the uploaded files will be saved in the upload/images directory relative to the current working directory of the Node.js process.
// filename Property:

// The filename property is a function that determines the name of the uploaded file. It takes three parameters:
// req: The HTTP request object.
// file: The file object representing the uploaded file.
// cb: A callback function to be called with the error (if any) and the filename.
// The generated filename is constructed using the following components:
// ${file.fieldname}: The field name of the file input in the form.
// Date.now(): A timestamp, ensuring a unique filename to avoid collisions.
// path.extname(file.originalname): The file extension of the original uploaded file.
// cb (Callback Function):

// The cb callback function is called with the generated filename. It is used to signal the completion of the filename generation and provide the result to multer. The first parameter is reserved for an error (if any), and the second parameter is for the filename.

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images

app.use("/images", express.static("upload/images"));

// successfull running

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// create schemas for any object or any projects

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  availabel: {
    type: Boolean,
    default: true,
  },
});

// end point to insert into database

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;

  if (products.length > 0) {
    // availabel in database
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    // if database is empty
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  // save data into database so we used await method
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// creating API for deleting Products

app.post("/removeproduct", async (req, res) => {
  // for delete product in mongoose we use find one delete
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for Getting all products

// get all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched!");
  res.send(products);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port : " + port);
  } else {
    console.log("Error : " + error);
  }
});
