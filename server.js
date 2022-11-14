const express = require("express");
const cors = require("cors");
const authenticateJWT = require("./middleware/authMiddleware");
const app = express();
// const connection = new WebSocket('ws://localhost:3000');
// router
const userRouter = require("./routers/userRoute");
const researchRouter = require("./routers/researchRoute")
const bodyParser = require("body-parser");

app.enable("trust proxy");
// allowed cors *
app.use(cors());
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
  console.log(`listening on port 3000`);
});
