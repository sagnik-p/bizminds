const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const supplierRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const issueRoute=require("./router/issue");
const salesRoute = require("./router/sales");
const stockRoute=require('./router/stock');
const cors = require("cors");
const Merchant = require("./models/merchants");
const Product = require("./models/product");
const ratingRoute = require("./router/rating");


const app = express();
const Port = process.env.PORT || 3000;
main();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Store API
app.use("/api/suppliers", supplierRoute);

// Ratings API
app.use("/api/ratings", ratingRoute);

// Issue API
app.use("/api/issues",issueRoute);

app.use("/api/stocks", stockRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

// ------------- Signin --------------
let merchantAuthCheck;
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  //res.send("hi");
  try {
    const merchant = await Merchant.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("Merchant: ", merchant);
    if (merchant) {
      res.send(merchant);
      merchantAuthCheck = merchant;
    } else {
      res.status(401).send("Invalid Credentials");
      merchantAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Getting Merchant Details of login merchant
app.get("/api/login", (req, res) => {
  res.send(merchantAuthCheck);
});
// ------------------------------------

// Registration API
app.post("/api/register", (req, res) => {
  console.log("trying to register");
  let registerMerchant = new Merchant({
    name: req.body.firstName,
    merchant_id:req.body.merchantId,
    shop_name:req.body.shopName,
    email: req.body.email,
    phone:req.body.phone,
    address:req.body.address,
    password: req.body.password,
  });

  registerMerchant
    .save()
    .then((result) => {
      res.status(200).send(result);
      //alert("Signup Successfull");
    })
    .catch((err) => console.log("Signup: ", err));
  console.log("request: ", req.body);
});


app.get("/testget", async (req,res)=>{
  const result = await Product.findOne({ _id: '6429979b2e5434138eda1564'})
  res.json(result)

})

// Here we are listening to the server
app.listen(Port, () => {
  console.log(`Server listening on port ${Port}`);
});
