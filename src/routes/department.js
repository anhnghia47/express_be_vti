const express = require("express");
const { departmentService } = require("../services/departmentService");
const router = express.Router();

router.get("/", async (req, res) => {
  const departments = await departmentService.getDepartments();

  res.send({
    data: departments,
  });
});

module.exports = router;
