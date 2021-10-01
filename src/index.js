import express from "express";
import cors from "cors";
import { getDashboardController } from "./controllers/dashboardController.js";
import { shareController } from "./controllers/shareController.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/health", (_, res) => res.send({ health: "OK" }));
app.get("/share", shareController);
app.post("/getDashboard", getDashboardController);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening at port ${process.env.PORT}`);
});
