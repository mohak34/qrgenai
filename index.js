const express = require("express");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/registrations", (req, res) => {
  const registrationsFilePath = path.join(__dirname, "registrations.txt");
  fs.readFile(registrationsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read registrations.txt:", err);
      return res.status(500).send("Failed to read registrations");
    }
    const registrationNumbers = data.split("\n").filter(Boolean);
    console.log("Registration numbers:", registrationNumbers); // Log the registration numbers
    res.json({ registrationNumbers });
  });
});

app.post("/generate", async (req, res) => {
  const { registrationNumbers } = req.body;
  const outputDir = path.join(__dirname, "qrcode");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const registrationNumber of registrationNumbers) {
    const qrCodePath = path.join(outputDir, `${registrationNumber}.png`);
    try {
      await QRCode.toFile(qrCodePath, registrationNumber);
      console.log(`QR Code generated for ${registrationNumber}`);
    } catch (err) {
      console.error(
        `Failed to generate QR Code for ${registrationNumber}:`,
        err
      );
      return res.status(500).send("Failed to generate QR Code");
    }
  }

  res.send("QR Codes generated successfully");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
