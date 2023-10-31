const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/products");
const Auth = require('../middleWares/auth');

router.get("/", Auth, (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', 'name')
        .exec()
        .then((docs) => {
            if (docs.length >= 1) {
                res.status(200).json({
                    Count: docs.length,
                    Orders: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            Product: doc.product,
                            Quantity: doc.quantity,

                            request: {
                                type: "GET",
                                url: "http://localhost:3000/orders/" + doc._id,
                            },
                        };
                    }),
                });
            } else {
                res.status(404).json({
                    Error: "No Schemas Found in Model",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.post("/", Auth,(req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then((product) => {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity,
            });

            return order.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "Order Placed",
                createdOrder: {
                    _id: result._id,
                    Product: result.product,
                    Quantity: result.quantity,
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                Message: "Order Placing Failed",
            });
        });
});

router.get("/:orderId", Auth,(req, res, next) => {
    orderId = req.params.orderId;
    Order.findById(orderId)
        .populate('product', 'name')
        .exec()
        .then((order) => {
            res.status(200).json({
                Order_Details: order,
                request: {
                    type: "GET",
                    url: "http:/localhost:3000/orders/" + order._id,
                },
            });
        })
        .catch((error) => {
            res.status(500).json({
                Message: "Order Not Found",
                Error: error,
            });
        });
});

router.delete("/:orderId", Auth,(req, res, next) => {
    id = req.params.orderId;
    Order.findByIdAndDelete(id)
        .exec()
        .then((result) => {
            res.status(200).json({
                Message: "Order Deleted",
            });
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
});

module.exports = router;
