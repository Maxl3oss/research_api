const express = require("express");
const cors = require("cors");
const authenticateJWT = require("./middleware/authMiddleware");
const app = express();
// router
const authRouter = require("./routers/authRoute");
const usersRouter = require("./routers/usersRoute");
const researchRouter = require("./routers/researchRoute");
const backendRouter = require("./routers/backendRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


app.enable("trust proxy");
// allowed cors *
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
// cookie
app.use(cookieParser());
// get request json
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// public path
app.use("/api/public", express.static(__dirname + '/uploads'));

// api
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/research", researchRouter);
app.use("/api/backend", backendRouter);
// app.use("/api", authenticateJWT, userRouter);

app.listen(3000, () => {
  console.log(`listening on port 3000 `);
});
