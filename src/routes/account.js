require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const { accountService, Account } = require("../services/accountServices");
const { hashPassword, authorization } = require("../utils/auth");
const { SESSION_SECRET } = require("../constants/schema");
const router = express.Router();

/**
 * @swagger
 * /accounts/auth:
 *  post:
 *     summary: Login
 *     tags:
 *     - Accounts
 *     description: Login
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.post("/auth", function (req, res, next) {
  let { username, password } = req.body;
  if (username && password) {
    accountService.auth({ username }, async (error, results, fields) => {
      if (error) {
        next(err);
      }
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { username, accountId: user["AccountID"] },
              SESSION_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.cookie("token", token);
            accountService
              .getAccountDetail(user?.AccountID)
              .then((result) => {
                if (err) {
                  console.error(err);
                } else {
                  res.send({ data: result });
                }
              })
              .catch((err) => {
                throw Error;
              });
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
 *     description: Get accounts
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", (req, res, next) => {
  let { page = 1, limit = 10, search } = req.query;

  try {
    accountService.getAccounts({ page, limit, search }, async (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({
          data: result?.map((account) => ({
            ...account,
          })),
          metadata: {
            total: await accountService.getTotalAccount(),
            page,
            limit,
          },
        });
      }
    });
  } catch (error) {
    throw new Error("Hello error!");
  }
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
router.get("/profile", authorization, (req, res, next) => {
  try {
    accountService
      .getAccountDetail(req?.userId)
      .then((result) => {
        res.send({ data: result });
      })
      .catch((err) => {
        throw Error;
      });
  } catch (error) {
    res.status(403).send({ message: "For hidden" });
  }
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
router.post("/", async (req, res, next) => {
  const { email, fullName, username, password } = req.body;
  //handles null error
  if (!(email && fullName && username && password)) {
    res.status(400).send({
      error: true,
      message: "Email, username, fullname, password are required",
    });
    return;
  }
  try {
    const newPassword = await hashPassword(password);
    var newAccount = new Account({ ...req.body, password: newPassword });

    const isEmailExisted = await accountService.checkEmailExists(email);
    const isUsernameExisted = await accountService.checkUsernameExists(
      username
    );
    if (isEmailExisted || isUsernameExisted) {
      res.status(400).send({
        error: true,
        message: `${isEmailExisted ? "Email" : "Username"} is existed`,
      });
      return;
    }
    accountService.createAccount(newAccount, (err, result) => {
      if (err) {
        next(err);
        res.status(400).send("Error");
      } else {
        accountService
          .getAccountDetail(result?.insertId)
          .then((result) => {
            res.send({ data: result });
          })
          .catch((err) => {
            throw Error;
          });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error });
  }
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
router.put("/:id", async (req, res, next) => {
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
      next(err);
      res.status(400).send("Error");
    } else {
      accountService
        .getAccountDetail(accountId)
        .then((result) => {
          res.send({ data: result });
        })
        .catch((err) => {
          throw Error;
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
router.delete("/:id", (req, res, next) => {
  accountService.deleteAccount(req.params.id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({ msg: "Delete succesful" });
    }
  });
});

module.exports = router;
