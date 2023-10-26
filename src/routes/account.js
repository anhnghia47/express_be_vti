const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const { accountService, Account } = require("../services/accountServices");
const { hashPassword } = require("../utils/auth");
const router = express.Router();

router.post("/auth", function (req, res) {
  let { username, password } = req.body;
  if (username && password) {
    accountService.auth({ username }, async (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign({ username }, "secrect_key", {
              expiresIn: "1h",
            });
            res.cookie("token", token);
            res.send({ msg: "Logged in" });
          } else {
            res
              .status(400)
              .send({ msg: "Incorrect Username and/or Password!" });
          }
        });
      } else {
        res.status(400).send({ msg: "Account not found" });
      }
    });
  } else {
    res.status(400).send({ msg: "Please enter Username and Password!" });
  }
});

/**
 * @swagger
 * /accounts:
 *  get:
 *     summary: Get accounts
 *     tags:
 *     - Accounts
 *     description: Get all account
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  accountService.getAccounts({ page, limit }, async (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({
        data: result,
        metadata: {
          total: await accountService.getTotalAccount(),
          page,
          limit,
        },
      });
    }
  });
});

/**
 * @swagger
 * /accounts/{id}:
 *  get:
 *     summary: Get account detail by id
 *     tags:
 *     - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *     description: Get account detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/:id", (req, res) => {
  accountService.getAccountDetail(req.params.id, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

/**
 * @swagger
 * /accounts:
 *  post:
 *     summary: Create the account by id
 *     tags:
 *     - Accounts
 *     requestBody:
 *      required: true
 *     description: Create account detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.post("/", async (req, res) => {
  const { email, fullName, username, departmentId, positionId, password } =
    req.body;
  //handles null error
  if (
    !(email && fullName && username && departmentId && positionId && password)
  ) {
    res.status(400).send({
      error: true,
      message:
        "Email, username, fullname, departmentId, positionId, password are required",
    });
    return;
  }
  const newPassword = await hashPassword(password);
  var newAccount = new Account({ ...req.body, password: newPassword });

  const isExisted = await accountService.checkEmailExists(email);
  if (isExisted) {
    res.status(400).send({ error: true, message: "Email is existed" });
    return;
  }

  accountService.createAccount(newAccount, (err, result) => {
    if (err) {
      throw err;
    } else {
      accountService.getAccountDetail(result?.insertId, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.send(result);
        }
      });
    }
  });
});

/**
 * @swagger
 * /accounts/{id}:
 *  put:
 *     summary: Edit the account by id
 *     tags:
 *     - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Create account detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.put("/:id", async (req, res) => {
  const { password } = req.body;
  let newPassword;
  if (password) {
    newPassword = await hashPassword(password);
  }
  const updateAccount = new Account({
    ...req.body,
    ...(password ? { password: newPassword } : {}),
  });
  const accountId = req.params.id;
  accountService.updateAccount(accountId, updateAccount, (err, result) => {
    if (err) {
      throw err;
    } else {
      accountService.getAccountDetail(accountId, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.send(result);
        }
      });
    }
  });
});

/**
 * @swagger
 * /accounts/{id}:
 *  delete:
 *     summary: Remove the account by id
 *     tags:
 *     - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.delete("/:id", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  accountService.deleteAccount(req.params.id, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({ msg: "Delete succesful" });
    }
  });
});

module.exports = router;
