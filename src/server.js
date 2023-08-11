import "dotenv/config";
import express from "express";
import UserService from "../src/services/user.service.js";
import authMiddleware from "./middlewares/auth.middleware.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ImagineShop API");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userServices = new UserService();
  try {
    const token = await userServices.login(email, password);
    return res.status(200).json({ access_token: token });
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
});

//R - READ
app.get("/users", authMiddleware, async (req, res) => {
  const userServices = new UserService();
  const users = await userServices.findAll();
  return res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const userServices = new UserService();
  const user = await userServices.findById(id);
  return res.status(200).json(user);
});

//C - CREATE
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const userServices = new UserService();
  await userServices.add(name, email, password);
  return res.status(201).json({ message: "success" });
});

// U - UPDATE
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const user = { name };
  const userService = new UserService();
  try {
    await userService.update(id, user);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//DELETE
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const userService = new UserService();
  try {
    await userService.delete(id);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server runnig at http://localhost:${port}`);
});
