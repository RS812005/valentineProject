const express = require("express");
const path = require("path");
const cookie_parser = require("cookie-parser");
const PORT = 8000;
const {auth}=require("./middlewares/auth");
const opsRouter=require("./routers/opsRouter")
const userRouter=require("./routers/userRouter")
const { connectToMongoDB } = require("./connection");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie_parser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB(
  process.env.MONGODB ?? "mongodb://localhost:27017/valentineProject"
).then(() => console.log("Mongodb connected"));

app.use("/users",userRouter);
app.use("/dashboard",auth,opsRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
