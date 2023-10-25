const db = require("../connect");
const getMarket = (req, res) => {
  const sql = "SELECT * FROM jenisbarang";
  db.query(sql, (error, result) => {
    jenisBarang = result;
    if (error) throw error;
    //jika terdapat user yang login atau terdapat data pada session
    if (req.session.user) {
      const sql = `SELECT * FROM user WHERE username = '${req.session.user.username}'`;
      db.query(sql, (error, result) => {
        if (error) throw error;
        const user = result[0];
        res.render("jenisBarang", { jenis: jenisBarang, user: user });
      });
    } else {
      res.render("jenisBarang", { jenis: jenisBarang, user: "" });
    }
  });
};

const tambahJenis = (req, res) => {
  const sql = `INSERT INTO jenisbarang(JenisBarang) VALUES ('${req.body.JenisBarang}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("/");
  });
};

const hapusJenis = (req, res) => {
  const sql = `DELETE FROM jenisbarang WHERE Id_JenisBarang = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("back");
  });
};

const getBarang = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM barang WHERE Id_JenisBarang = ${id}`;
  db.query(sql, (error, result1) => {
    const barang = result1;
    if (error) throw error;
    const uang = (rupiah) => {
      return rupiah.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    };
    if (req.session.user) {
      const sql = `SELECT * FROM user WHERE username = '${req.session.user.username}'`;
      db.query(sql, (error, result) => {
        if (error) throw error;
        const user = result[0];
        console.log(user);
        res.render("barang", {
          bar: barang,
          idJbar: id,
          uang,
          user: user,
        });
      });
    } else {
      res.render("barang", {
        bar: barang,
        idJbar: id,
        uang,
        user: "",
      });
    }
  });
};
const hapusBarang = (req, res) => {
  const sql = `DELETE FROM barang WHERE Id_barang = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("back");
  });
};

const tambahBarang = (req, res) => {
  const image = req.file ? req.file.filename : null;
  const sql = `INSERT INTO barang(Nama_barang, id_jenisBarang, harga, stock, new_stock, image) VALUES ('${req.body.NamaBarang}', '${req.body.Id_JenisBarang}', '${req.body.harga}', '${req.body.stock}', '${req.body.stock}', '${image}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

const tambahTransaksi = (req, res) => {
  if (req.session.user) {
    const jumlah = req.body.jumlah;
    const total = req.body.total;
    const sql = `INSERT INTO transaksi(id_barang, jumlah, total_harga, status, id_user) VALUES ('${req.body.barang_id}', '${jumlah}', '${total}','0', ${req.session.user.id})`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      const sql2 = `UPDATE barang SET new_stock = '${req.body.new_Stock}' WHERE id_barang = ${req.body.barang_id}`;
      db.query(sql2, (error, result) => {
        if (error) throw error;
        res.redirect("back");
      });
    });
  } else {
    res.render("login", { pesan: "anda harus login", clas: "danger" });
  }
};

const cancel = (req, res) => {
  const sql = `UPDATE barang SET new_stock = ${req.body.stockBaru} WHERE id_barang = ${req.body.barang_id2}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    const sql2 = `DELETE FROM transaksi WHERE id_transaksi = ${req.body.id_transaksi}`;
    db.query(sql2, (error, result) => {
      if (error) throw error;
      res.redirect("back");
    });
  });
};

const editJenis = (req, res) => {
  //ubah tabel di jenis barang, dengan kolom Jenis Barang dengan isi yang ada di formulir edit
  const sql = `UPDATE jenisBarang SET JenisBarang = '${req.body.Jenis}' WHERE Id_JenisBarang = ${req.body.id_jenis} `;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

const transaksi = (req, res) => {
  if (req.session.user) {
    const id = req.params.id;
    const sql2 = `SELECT * FROM transaksi JOIN barang ON transaksi.id_barang = barang.Id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
    db.query(sql2, (error, result2) => {
      if (error) throw error;
      const transaksi = result2;
      const sql3 = `SELECT SUM(total_harga) AS total FROM transaksi JOIN barang ON transaksi.id_barang = barang.Id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
      db.query(sql3, (error, result3) => {
        const total = result3;
        const uang = (rupiah) => {
          return rupiah.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          });
        };
        res.render("transaksi", {
          transaksi,
          idJbar: id,
          total,
          uang,
        });
      });
    });
  } else {
    res.redirect("back");
  }
};

const shop = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM barang WHERE Id_JenisBarang = ${id}`;
  db.query(sql, (error, result1) => {
    const barang = result1;
    if (error) throw error;
    const uang = (rupiah) => {
      return rupiah.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    };
    res.render("shop", {
      bar: barang,
      idJbar: id,
      uang,
    });
  });
};
module.exports = {
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
};
