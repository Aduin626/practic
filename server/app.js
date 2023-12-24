import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import morgan from "morgan";
import fs from "fs";

import authRouter from "./router/auth.js";
import appicationRouter from "./router/application.js";

const app = express();

dotenv.config();

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const access_token_secret = generateRandomToken();
const refresh_token_secret = generateRandomToken();
const corsOption = { credential: true, origin: process.env.URL || "*" };
//Запись токинов в файл
fs.writeFileSync(
  ".env",
  `ACCESS_TOKEN_SECRET=${access_token_secret}\nREFRESH_TOKEN_SECRET=${refresh_token_secret}`
);

app.use(morgan("dev"));
app.use(express.static("client"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api", appicationRouter);

export default app;
