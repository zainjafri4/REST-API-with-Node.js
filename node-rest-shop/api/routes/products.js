const express = require("express");
const router = express.Router();

const Product = require("./models/products");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
    Product.find().select('name price _id').exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 1) {
                const response = {
                    count: docs.length,
                    Products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: "GET",
                                url: '/products/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json({ response })
            } else {
                res.status(404).json({
                    Error: "No Schemas Found in Model"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error)
        })
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });

    product
        .save()
        .then(result => {
            console.log("Product saved successfully:");
            console.log(result);
            res.status(200).json({
                message: "Product Added",
                Product: {
                    name : result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.error("Error while saving product:");
            res.status(500).json({
                error: err
            })
        });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;

    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     return res.status(404).json({ message: "Invalid id" });
    // }

    Product.findById(id).select('name price _id').exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    Product : doc,
                    request: {
                        type : "GET",
                        url: '/products/'+ doc._id
                    }
                });
            } else {
                res.status(404).json({ message: "Invalid id" });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId

    updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.findByIdAndUpdate(id, { $set: updateOps }).exec()
        .then(result => {

            res.status(200).json({
                message: "Product Updated",
                request: {
                    type : "GET",
                    url: '/products/' + id
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId
    Product.findByIdAndDelete(id).exec()
        .then(result => {
            res.status(200).json({
                message : "Product Deleted",
                request: {
                    type : "POST",
                    url: 'http://localhost:3000/products'
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
});

module.exports = router;