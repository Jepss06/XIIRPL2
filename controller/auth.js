const db = require("../connect");
const bcrypt = require("bcrypt");
const login = (req, res) => {
  res.render("login", { clas: "", pesan: "" });
};

const register = (req, res) => {
  res.render("register", { clas: "", pesan: "" });
};
const registrasi = (req, res) => {
  const { username, password, pass_confirm } = req.body;
  const check = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(check, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      return res.render("register", {
        class: "danger",
        pesan: "username telah terdaftar, silahkan sadar diri",
      });
    }
    if (password != pass_confirm) {
      return res.render("register", {
        clas: "danger",
        pesan: "partai anda beda",
      });
    }
    const min = 100000;
    const max = 999999;
    const token = Math.floor(Math.random() * (max - min + 1) + min);
    bcrypt.hash(password, 10, (errorhash, hash) => {
      if (errorhash) throw error;
      const sql = `INSERT INTO user(username, password, token) VALUES ('${username}, '${hash}', ${token}')`;
      db.query(sql, (error, result) => {
        res.render("register", {
          pesan: "registrasi berhasil",
          clas: "success",
        });
      });
    });
  });
};

const auth = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("login", {
      pesan: "password dan username tidak boleh kosong, cukup hati aja",
      clas: "danger",
    });
  }
  const query = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(query, (error, result) => {
    if (error) throw error;
    if (result.length === 0) {
      res.render("login", {
        pesan: "username tidak ditemukan",
        clas: "danger",
      });
    }
    const user = result[0];
    bcrypt.compare(password, user.password, (HashError, hash) => {
      if (HashError) throw HashError;
      var number = 10000;
      if (!hash) {
        res.render("login", { pesan: "password anda salah!", clas: "danger" });
      }
    });
    req.session.user = {
      id: user.id_user,
      username: user.username,
    };
    res.redirect("/getMarket");
  });
};
const logout = (req, res) => {
  req.session.destroy();
  res.render("login", { pesan: "anda telah logout", clas: "success" });
};

module.exports = { login, register, registrasi, auth, logout };
