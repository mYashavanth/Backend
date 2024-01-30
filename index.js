const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const DataBase = require("./db");
const cookieParser = require("cookie-parser");
const notesRouter = require("./Routes/NotesRoutes");
const userRouter = require("./Routes/UserRoutes");
const cors = require("cors");

app.use(cors({ credentials: true, origin: "*" }));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/notes", notesRouter);
app.use("/users", userRouter);
app.get("*", (req, res) => {
  res.status(404).send("404 page not found");
})

app.listen(PORT, async () => {
  await DataBase();
  console.log(`server is running on http://localhost:${PORT}`);
});
