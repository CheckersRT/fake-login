import express from "express";
import path from "path";
// import { fileURLToPath } from 'url'

const PORT = process.env.PORT || 3000;
const app = express();
const dirName = path.dirname(new URL(import.meta.url).pathname);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let loginSuccess = null;

app.get("/", (req, res) => {
  console.log("Someone wants the root route");
  res.sendFile(path.join(dirName, "index.html"));
});

app.get("/index.css", (req, res) => {
  console.log("Someone wants the root route");

  res.sendFile(path.join(dirName, "index.css"));
});

app.get("/echo/:message", (req, res) => {
  const message = req.params.message;
  if (message === "secret") {
    res.json("The secret is...42!");
  }
  res.json(message);
});

app.get("/login", (req, res) => {
  console.log("no response.success");
  res.sendFile(path.join(dirName, "login.html"));
});

app.use("/login", (req, res, next) => {
  if (loginSuccess === true) {
    res.redirect("/account");
  } else if (loginSuccess === false) {
    res.redirect("/error");
  } else {
    next();
  }
});

app.post("/login", async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    loginSuccess = false;
    res.json({ "success": false });
  } else if (
    req.body.email === "user@email.com" &&
    req.body.password === "very-secret"
  ) {
    loginSuccess = true;
    res.json({ "success": true });
  } else {
    loginSuccess = false;
    res.json({ "success": false });
  }
  next();
});

app.get("/account", (req, res) => {
    res.sendFile(path.join(dirName, "account.html"));
    loginSuccess = null
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(dirName, "error.html"));
    loginSuccess = null
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
