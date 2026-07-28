const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", project: "TounesPrix" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
