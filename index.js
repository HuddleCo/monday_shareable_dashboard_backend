import express from "express";
import cors from "cors";
import { getDashboardController } from "./controllers/dashboardController.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/getDashboard", getDashboardController);

app.get("/share", (req, res) => {
  const filename = req.query.filename;
  const data = fs.readFileSync(filename, {
    encoding: "utf8",
    flag: "r",
  });
  res.send(data);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening at port ${process.env.PORT}`);
});
