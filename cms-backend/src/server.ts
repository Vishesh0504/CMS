const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const app = express();

import { authRouter } from "./routes/auth/users.routes";
import dashRouter from "./routes/dashboard/dashboard.routes";
import verifyAuth from "./routes/protected";
app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(cookie_parser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRouter);
app.use('/dashboard',verifyAuth,dashRouter);

https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "../certificates/key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "../certificates/cert.pem")),
    },
    app,
  )
  .listen(8080, () => {
    console.log(`Listening on port 8080`);
  });