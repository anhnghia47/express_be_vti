const express = require("express");
const {
  categoryService,
  ShippingOrder,
  ShippingBranch,
} = require("../services/shippingBranchService");
const { shippingBranchService } = require("../services/shippingBranchService");
const router = express.Router();

router.get("/", async (req, res) => {
  const shippingBranchs = await shippingBranchService.getShippingBranchs();

  res.send({
    data: shippingBranchs,
  });
});

router.post("/", async (req, res, next) => {
  try {
    const { branchName, branchAddress } = req.body;
    if (!(branchName && branchAddress)) {
      res.status(400).json({
        message: "BranchName, branchAddress are required",
      });
      return;
    }
    // const order = new ShippingOrder(req.body);
    shippingBranchService.createShippingBranch(req.body, (err, result) => {
      if (err) {
        next(err);
      } else {
      }
      res.send({ message: "Successful" });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res, next) => {
  const branchId = req.params.id;
  try {
    let isExisted = await shippingBranchService.checkBranchIdExists(branchId);

    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    const updateShippingBranch = new ShippingBranch(req.body);
    shippingBranchService.updateShippingBranch(
      branchId,
      updateShippingBranch,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit succesfull" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product category by ID
router.delete("/:id", async (req, res) => {
  try {
    const branchId = req.params.id;
    let isExisted = await shippingBranchService.checkBranchIdExists(
      branchId
    );
    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    await shippingBranchService.deleteShippingBranch(branchId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Delete succesful" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
