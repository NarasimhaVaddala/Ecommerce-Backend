const express = require("express");
const router = express.Router();
const product = require("../modals/product");
const userModal = require('../modals/user');
const isLogin = require("../middleware/isLogin");

router.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await product.find({ _id: id });
    if (!data) {
      return res.status(404).send({ success: false });
    } else {
      return res.status(200).send({ success: true, data: data });
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

router.post('/insert', async (req, res) => {
  try {
    const data = await product.create(req.body);
    if (!data) {
      return res.status(400).send({ success: false, error: 'Failed to create product' });
    }
    return res.status(200).send({ success: true, data: data });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

router.get('/:gender/:category/:type', async (req, res) => {
  try {
    const { gender, category, type } = req.params;
    
    let data;
    if (!type || type=="undefined" || type==undefined || type==null ) {
      data = await product.find({ category: category, gender: gender });
    } else {
      data = await product.find({ category: category, gender: gender, type: type });
    }
    return res.status(200).send({ success: true, data: data });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});



//================ Cart Operations  =================

router.post('/cart', isLogin, async (req, res) => {
  console.log(req.user);
  try {
    const { productId, quantity, size } = req.body;    
    const user = await userModal.findById(req.user);
    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId && item.size === size);
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
      
    await user.save();
    res.status(200).json(user.cart);
    } else {
      user.cart.push({ productId, quantity, size });
      
    await user.save();
    res.status(200).json(user.cart);
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

router.put('/cart/decrease', isLogin, async (req, res) => {


  try {
    const { productId, size } = req.body;
    const user = await userModal.findById(req.user);

    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId && item.size === size);
    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        user.cart.splice(itemIndex, 1);
      }

      await user.save();
      res.status(200).json(user.cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

router.get('/cart', isLogin, async (req, res) => {
  try {
    const user = await userModal.findById(req.user).populate('cart.productId');
    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});


router.delete('/cart/delete', isLogin, async (req, res) => {
  console.log("delete", req.user);
  
  try {
    const { productId, size } = req.body;
    console.log("delete", req.body);

    if (!productId || !size) {
      return res.status(400).send({ success: false, error: "Both productId and size are required" });
    }

    const result = await userModal.updateOne(
      { _id: req.user },
      { $pull: { cart: { productId: productId, size: size } } }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const user = await userModal.findById(req.user).populate('cart.productId');
    return res.status(200).json({ success: true, cart: user.cart });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ success: false, error: error.message });
  }
});

//================ Cart Operations  =================




//================ WishList Operations  =================
// Add item to wishlist

router.post('/wishlist', isLogin, async (req, res) => {

  console.log(req.user);
  try {
    const { productId } = req.body;
    console.log(req.body);

    if (!productId) {
      return res.status(400).send({ success: false, error: "productId is required" });
    }

    const user = await userModal.findById(req.user);
    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }

    const alreadyExists = user.wishlist.find(item => item.productId.toString() === productId);
    if (alreadyExists) {
      return res.status(400).send({ success: false, message: 'Item already in wishlist' });
    }

    user.wishlist.push({ productId });
    await user.save();
    return res.status(200).json({ success: true, wishlist: user.wishlist });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ success: false, error: error.message });
  }
});

// Delete item from wishlist
router.delete('/wishlist', isLogin, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send({ success: false, error: "productId is required" });
    }

    const user = await userModal.findByIdAndUpdate(
      req.user,
      { $pull: { wishlist: { productId: productId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ success: false, error: error.message });
  }
});

// Get wishlist
router.get('/wishlist', isLogin, async (req, res) => {
  try {
    const user = await userModal.findById(req.user).populate('wishlist.productId');
    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ success: false, error: error.message });
  }
});
//================ WishList Operations  =================








module.exports = router;
