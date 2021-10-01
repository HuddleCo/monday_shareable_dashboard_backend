import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getDashboardController } from "./controllers/dashboardController.js";
import { shareController } from "./controllers/shareController.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// DEPRECATED: Remove this in the next major release
app.get("/", (req, res) => res.send("Server is running"));
app.get("/health", (_, res) => res.send({ health: "OK" }));
app.get("/share", shareController);
app.post("/getDashboard", getDashboardController);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening at port ${process.env.PORT}`);
});
