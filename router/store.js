const express = require("express");
const app = express();
const router=express.Router();
const supplier = require("../controller/store");
const Supplier = require("../models/suppliers.js");
const Product=require("../models/product.js");

// Add Supplier
router.post("/add", async (req, res) => {
    console.log(req.body)
  const addSupplier = await new Supplier({
    userID : req.body.userId,
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    city: req.body.city,
    image: req.body.image
  });

  addSupplier.save().then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
});

//rating:[Average rating,Delivery,Quality,Responsiveness,Price]
//Get all suppliers sorted according to various rating parameters
router.get('/:rating_index', async (req, res) => {
    try {
        const ratingIndex = parseInt(req.params.rating_index);

        // const supplierInfo = await db.collection("suppliers");

        const pipeline = [
            {
                $project: {
                    _id: 1,
                    supplier_id: 1,
                    name: 1,
                    shop_name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    products_sold: 1,
                    product_prices: 1,
                    rating: 1,
                }
            },
            {
                $sort: {
                    [`rating.${ratingIndex}`]: -1 // Sort by the specified index of the ratings array in descending order
                }
            }
        ];

        const sortedSuppliers = await Supplier.aggregate(pipeline);

        res.json(sortedSuppliers);
    } catch (error) {
        console.error('Error while fetching sorted suppliers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get_supplier/:supplier_id', async (req, res) => {
    try {
      console.log("geting suppliers");
        const supplierId = req.params.supplier_id;
        console.log('Supplier ID:', supplierId);

        if (!supplierId) {
            return res.status(400).json({ error: 'Supplier ID is missing in query parameters' });
        }

        const supplier = await Supplier.findOne({ "supplier_id": supplierId });

        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        console.log("geting suppliers");
        res.json(supplier);
        console.log("geting suppliers");
    } catch (error) {
        console.error('Error while fetching supplier:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/by_productID/:product_id', async (req, res) => {
    try {
        const productId = req.params.product_id;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is missing in query parameters' });
        }

        // const supplierInfo = db.collection("suppliers");

        // Find suppliers that sell the specified product
        const suppliers = await Supplier.find({ "products_sold": productId });

        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ error: 'Suppliers for the product not found' });
        }

        // If multiple suppliers sell the product, sort them by average rating
        if (suppliers.length > 1) {
            suppliers.sort((a, b) => {
                const avgRatingA = a.rating.reduce((acc, curr) => acc + curr, 0) / a.rating.length;
                const avgRatingB = b.rating.reduce((acc, curr) => acc + curr, 0) / b.rating.length;
                return avgRatingB - avgRatingA; // Sort in descending order of average ratings
            });
        }

        res.json(suppliers);
    } catch (error) {
        console.error('Error while fetching suppliers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/by_product_name/:name', async (req, res) => {
  try {
    const productName = req.params.name;

    // Find product details by name
    const product = await Product.findOne({ name: {$regex:productName,$options:"i"} });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch suppliers selling this product
    const suppliers = await Supplier.find({ products_sold: product.product_id });

    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({ message: 'Suppliers not found for this product' });
    }

    // Sort suppliers based on the 0th index of ratings array
    suppliers.sort((a, b) => {
      const ratingA = a.rating && a.rating.length > 0 ? parseFloat(a.rating[0]) : 0;
      const ratingB = b.rating && b.rating.length > 0 ? parseFloat(b.rating[0]) : 0;
      return ratingB - ratingA; // Sort in descending order of the 0th index of ratings
    });

    res.json({ product: product, suppliers: suppliers });
  } catch (error) {
    console.error('Error while fetching supplier info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  

module.exports = router;
