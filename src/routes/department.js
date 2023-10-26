const express = require("express");
const { departmentService } = require("../services/departmentService");
const router = express.Router();

/**
 * @swagger
 * /departments:
 *  get:
 *     summary: Get all departments
 *     tags:
 *     - Departments
 *     description: Get all departments
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", async (req, res) => {
  const departments = await departmentService.getDepartments();

  res.send({
    data: departments,
  });
});

module.exports = router;
