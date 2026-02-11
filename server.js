const express = require("express");
const cors = require("cors");

const executeRoute = require("./routes/execute");
const submitRoute = require("./routes/submit");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/execute", executeRoute);
app.use("/submit", submitRoute);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("✅ Backend is alive");
});