const express = require("express");
const cors = require("cors");
const authenticateJWT = require("./middleware/authMiddleware");
const app = express();
// router
const userRouter = require("./routers/userRoute");
const researchRouter = require("./routers/researchRoute");
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
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use("/api/user", userRouter);
app.use("/api/research", researchRouter);
// app.use("/api", authenticateJWT, userRouter);

app.listen(3000, () => {
  console.log(`listening on port 3000 `);
});
