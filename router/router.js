var express = require("express");
let router = express.Router();
const multer = require("multer");
const { login, register, registrasi, auth, logout } = require("../controller/auth");
const {
  getMarket,
  tambahJenis,
  hapusJenis,
  getBarang,
  hapusBarang,
  tambahBarang,
  tambahTransaksi,
  cancel,
  editJenis,
  transaksi,
  shop,
} = require("../controller/market");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getMarket);
router.get("/pilih/:id", getBarang);
router.get("/hapusBarang/:Id_barang", hapusBarang);
router.get("/hapusJenis/:id", hapusJenis);
//function edit jenis akan berjalan ketika url editJenis diakses
router.get("/login", login);
router.get("/getMarket", getMarket);
router.get("/transaksi", transaksi);
router.get("/shop/:id", shop);
router.get("/register", register);
router.post("/cancelTransaksi", cancel);
router.post("/tambahTransaksi", tambahTransaksi);
router.post("/tambahJenisBarang", tambahJenis);
router.post("/registrasi", registrasi);
router.post("/tambahBarang", upload.single("photo"), tambahBarang);
router.post("/auth", auth);
router.post("/editJenis", editJenis);
router.get('/logout', logout)
module.exports = router;