const express = require("express");
const multer = require("multer");
const sql = require("mssql");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public")); // Serve static files

// Configure SQL Server
const dbConfig = {
  user: "test",
  password: "test",
  server: "MSI",
  database: "SQLTUTORIAL",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


// Configure Multer (for file upload)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// API to Upload Image and Store in SQL Server
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const imageBuffer = fs.readFileSync(filePath);

    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    request.input("name", sql.NVarChar, req.file.filename);
    request.input("image", sql.VarBinary, imageBuffer);

    await request.query(
      "INSERT INTO Images (name, image) VALUES (@name, @image)"
    );

    res.send("Image uploaded successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/image/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT image FROM Images WHERE id = @id");

    if (result.recordset.length > 0) {
      const imageData = result.recordset[0].image;
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(imageData);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});