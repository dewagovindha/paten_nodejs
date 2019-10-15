require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
const sequelize = new Sequelize("db_paten1", "govindha", "0db6551e", {
  host: "db4free.net",
  dialect: "mysql"
});
const PORT = process.env.PORT;

app.use(express.json());

app.get("/start", (request, response, next) => {
  const hour = new Date().getUTCHours() + 8;

  return response.status(200).json({
    waktu:
      hour >= 1 && hour <= 9
        ? "Pagi"
        : hour >= 10 && hour <= 13
        ? "Siang"
        : hour >= 14 && hour <= 18
        ? "Sore"
        : "Malam"
  });
});

app.get("/ktp/status", async (request, response, next) => {
  try {
    const [result] = await sequelize.query(
      `SELECT * FROM tb_status_ktp WHERE tb_status_ktp.nik = ${request.query.nik}`
    );

    if (result.length > 0) {
      return response.status(200).json(result[0]);
    }

    const [respon] = await sequelize.query(
      "SELECT tb_respon.respon FROM tb_respon WHERE tb_respon.block = 'cek_ktp'"
    );

    return response.status(200).json({ message: respon[0].respon });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi Kesalahan"
    });
  }
});

app.put("/ktp/status/:nik", async (request, response, next) => {
  try {
    await sequelize.query(
      `UPDATE tb_status_ktp SET tb_status_ktp.status_pengambilan = 'Sudah' WHERE tb_status_ktp.nik = ${request.params.nik}`
    );
    return response.status(200);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi Kesalahan"
    });
  }
});

app.get("/kk/status", async (request, response, next) => {
  try {
    const [result] = await sequelize.query(
      `SELECT * FROM tb_status_kk WHERE tb_status_kk.nik_kpl = ${request.query.nik}`
    );

    if (result.length > 0) {
      return response.status(200).json(result[0]);
    }

    const [respon] = await sequelize.query(
      "SELECT tb_respon.respon FROM tb_respon WHERE tb_respon.block = 'cek_kk'"
    );

    return response.status(200).json({ message: respon[0].respon });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi Kesalahan"
    });
  }
});

app.put("/kk/status/:nik", async (request, response, next) => {
  try {
    await sequelize.query(
      `UPDATE tb_status_kk SET tb_status_kk.status_pengambilan = 'Sudah' WHERE tb_status_kk.nik_kpl = ${request.params.nik}`
    );
    return response.status(200);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi Kesalahan"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server starts at ${PORT}`);
});
