const express = require("express");
const bcrypt = require("bcrypt");
const { accountService, Account } = require("../services/accountServices");
const router = express.Router();

router.post("/auth", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    accountService.auth(
      { username, password },
      async (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;

          let comparePass = await bcrypt.compare(req.body.password, "a");

          console.log(comparePass);

          res.redirect("/home");
        } else {
          res.send({ msg: "Incorrect Username and/or Password!" });
        }
        res.end();
      }
    );
  } else {
    res.status(400).send({ msg: "Please enter Username and Password!" });
  }
});

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

router.get("/:id", (req, res) => {
  accountService.getAccountDetail(req.params.id, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

router.post("/", async (req, res) => {
  var newAccount = new Account(req.body);
  const { Email, FullName, Username, DepartmentID, PositionID } = newAccount;

  //handles null error
  if (!(Email && FullName && Username && DepartmentID && PositionID)) {
    res.status(400).send({
      error: true,
      message:
        "Email, username, fullname, departmentId, positionId are required",
    });
    return;
  }

  const isExisted = await accountService.checkEmailExists(Email);
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

router.put("/:id", (req, res) => {
  const updateAccount = new Account(req.body);
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

router.delete("/:id", (req, res) => {
  accountService.deleteAccount(req.params.id, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({ msg: "Delete succesful" });
    }
  });
});

module.exports = router;
