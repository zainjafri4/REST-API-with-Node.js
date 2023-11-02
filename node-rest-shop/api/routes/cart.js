const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/products');

router.post('/', async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId).exec();

    if (!product) {
      return res.status(404).json({
        Message: "Product ID Not Found",
      });
    }

    const cart = new Cart({
    //   _id: new mongoose.Types.ObjectId(),
      product: product._id,
      quantity: req.body.quantity,
    });

    const newCart = await cart.save();

    res.status(200).json({
      Message: "Product Added to Cart",
      Cart: {
        Quantity: newCart.quantity,
        Product: product._id,
        cartId : cart._id
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      Message: "Error Occurred",
      error: error,
    });
  }
});

router.get('/', async (req, res, next) => {
    try {
      const results = await Cart.find().exec();
  
      if (results.length < 1) {
        return res.status(404).json({
          Error: "No Carts Found in the Database",
        });
      }
  
      console.log(results);
      res.status(200).json({
        Count: results.length,
        Carts: results.map((result) => {
          return {
            Product: result.product,
            Quantity: result.quantity,
            cartId : result._id
          };
        }),
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({
        Message: "Error Occurred",
        Error: error,
      });
    }
  });
  
router.get('/:carId', async (req, res, next)=>{
    const id = req.params.cartId
    try 
    {
        const cart = await Cart.findById(id).exec();
        res.status(200).json({
            Product : cart.productId,
            Quantity : cart.quantity
        })
    }
    catch (error){
        res.status(500).json({
            Message : "Error Occured",
            Error : error
        })
    }
})

router.delete('/:cartId', async ( req, res, next)=>{
    const id = req.params.cartId
    try {
    const result = await Cart.findByIdAndDelete(id).exec();
    res.status(200).json({
        Message : "Cart Product Deleted"
    })
    }
    catch (error) {
        res.status(500).json({
            Message : "Error Occured",
            Error : error
        })
    }

})

module.exports = router;
