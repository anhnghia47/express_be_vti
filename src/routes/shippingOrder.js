const express = require("express");
const {
  categoryService,
  ShippingOrder,
} = require("../services/shippingOrderService");
const { shippingOrderService } = require("../services/shippingOrderService");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  const shippingOrderDetail = await shippingOrderService.getShippingOrderDetail(
    {
      orderId,
    }
  );

  if (shippingOrderDetail?.orderID) {
    res.send({
      data: shippingOrderDetail,
    });
  } else {
    res.status(404).send({ message: "ShippingOrder not found" });
    return;
  }
});

router.get("/", async (req, res) => {
  let { branchId } = req.query;
  const shippingOrders = await shippingOrderService.getShippingOrders({
    branchId,
  });

  res.send({
    data: shippingOrders,
  });
});

/**
 * @swagger
 * /shipping-order:
 *  post:
 *     summary: create new category
 *     tags:
 *     - shipping-order
 *     description: Create new category
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.post("/", async (req, res, next) => {
  try {
    const {
      senderName,
      senderAddress,
      senderPhoneNumber,
      packageType,
      receiverName,
      receiverAddress,
      reveiverPhoneNumber,
    } = req.body;
    if (
      !(
        senderName &&
        senderAddress &&
        senderPhoneNumber &&
        packageType &&
        receiverName &&
        receiverAddress &&
        reveiverPhoneNumber
      )
    ) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    // const order = new ShippingOrder(req.body);
    shippingOrderService.createShippingOrder(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error" });
      } else {
        res.send({ message: "Successful" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /shipping-order/{id}:
 *  put:
 *     summary: Edit the category by id
 *     tags:
 *     - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Edit category detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.put("/:id", async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await categoryService.checkShippingOrderIdExists(
      categoryId
    );

    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    const updateShippingOrder = new ShippingOrder({
      ...req.body,
      categoryName: req.body?.categoryName,
    });
    categoryService.updateProductShippingOrder(
      categoryId,
      updateShippingOrder,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit product detail" });
        }
      }
    );
  } catch (error) {}
});

// Delete a product category by ID
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    let isExisted = await categoryService.checkShippingOrderIdExists(
      categoryId
    );
    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    await categoryService.deleteShippingOrder(categoryId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ msg: "Delete succesful" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
