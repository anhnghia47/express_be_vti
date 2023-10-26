const express = require("express");
const { positionService } = require("../services/positionService");
const router = express.Router();

/**
 * @swagger
 * /positions:
 *  get:
 *     summary: Get all positions
 *     tags:
 *     - positions
 *     description: Get all positions
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", async (req, res) => {
  const positions = await positionService.getPositions();

  res.send({
    data: positions,
  });
});

module.exports = router;
