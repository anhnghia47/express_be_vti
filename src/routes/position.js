const express = require("express");
const { positionService } = require("../services/positionService");
const router = express.Router();

router.get("/", async (req, res) => {
  const positions = await positionService.getPositions();

  res.send({
    data: positions,
  });
});

module.exports = router;
