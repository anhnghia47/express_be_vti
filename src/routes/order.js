const express = require("express");
const { categoryService } = require("../services/shippingOrderService");
const { ShippingOrder } = require("../services/shippingOrderService");
const { orderService, Order } = require("../services/orderService");
const connection = require("../databases/mysql");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  const shippingOrderDetail = await orderService.getOrderDetail({
    orderId,
  });

  if (shippingOrderDetail?.order_id) {
    res.send({
      data: shippingOrderDetail,
    });
  } else {
    res.status(404).send({ message: "Order not found" });
    return;
  }
});

router.get("/", async (req, res) => {
  let { branchId } = req.query;
  const orders = await orderService.getOrders({
    branchId,
  });

  res.send({
    data: orders,
  });
});

router.post("/", async (req, res, next) => {
  try {
    const {
      customer_fullname,
      shipping_address,
      customer_phone,
      customer_email,
      payment_method,
      items,
    } = req.body;
    if (
      !(
        customer_fullname &&
        shipping_address &&
        customer_phone &&
        customer_email &&
        payment_method &&
        items
      )
    ) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'Invalid request format. "items" should be an array.',
      });
    }

    const order = new Order(req.body);
    let orderId = await orderService
      .createOrder(order)
      .then((res) => {
        return res.insertId;
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "Error" });
      });

    items.map(async (item) => {
      const [existingRows] = await new Promise((resolve, reject) =>
        connection.query(
          "SELECT * FROM Product WHERE ProductId = ?",
          [item.productId],
          (error, results) => {
            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        )
      );
      if (existingRows?.ProductId) {
        connection.query(
          "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
          [orderId, item.productId, item.quantity]
        );
      }
    });
    res.json({ message: "Succesfull" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res, next) => {
  const orderId = req.params.id;
  try {
    let isExisted = await orderService.checkOrderIdExists(orderId);

    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    const { shipping_status, order_status } = req.body;
    orderService.updateOrder(
      orderId,
      { shipping_status, order_status },
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit order status successful" });
        }
      }
    );
  } catch (error) {}
});

// Delete a product category by ID
router.delete("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    let isExisted = await orderService.checkOrderIdExists(orderId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }

    await new Promise((resolve, reject) =>
      connection.query(
        `DELETE FROM order_items WHERE order_id = ${orderId}`,
        (error, results) => {
          if (error) {
            res.status(500).send({ message: "Error" });
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      )
    );
    await orderService
      .deleteOrder(orderId)
      .then((response) => {
        res.send({ message: "Delete succesful" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Error" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
