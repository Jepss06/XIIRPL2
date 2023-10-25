var express = require("express");
var app = express();
const bodyparser = require("body-parser");
const port = 5000;
var router = require("./router/router");
const path = require("path");
const session = require("express-session");
const db = require("./connect");
const MySQLStore = require("express-mysql-session")(session);
//fungsinya untuk menjalankan req.body
app.use(bodyparser.json());
//fungsinya untuk menjalankan post
app.use(bodyparser.urlencoded({ extended: true }));

const sessionStore = new MySQLStore(
  {
    expiration: 24 * 60 * 60 * 1000,
    clearExpired: true,
    createDatabaseTable: true,
  },
  db
);
app.use(
  session({
    secret: "secret-key",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", "view");
//berfungsi untuk menggabungkan folder dengan folder public dan untuk mengakses folder public
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      //jika filenya berakhir dengan css maka atur headernya dengan content type css, jika berakhir dengan js maka set headernya dengan content type javascript
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

app.use(router);

app.listen(port, () => {
  console.log("server telah dibuat" + port);
});
