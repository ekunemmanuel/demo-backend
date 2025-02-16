import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authenticateUser, verifyToken } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://demo-frontend-seven-psi.vercel.app",
].filter((origin): origin is string => origin !== undefined);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  const authResult = authenticateUser(username, password);
  if (authResult.success) {
    res.cookie("tokens", authResult.token);
    res.status(200).send({ message: authResult.message });
  } else {
    res.status(401).send({ message: authResult.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("tokens");
  res.status(200).send({ message: "Logout successful" });
});

app.get("/protected", verifyToken, (req, res) => {
  res.send("This is a protected route");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
