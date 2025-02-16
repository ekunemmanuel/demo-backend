import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key";

export const authenticateUser = (username: string, password: string) => {
  // In a real application, you would query the database or another data source
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    console.log(token);
    
    return { success: true, message: "Authentication successful", token };
  } else {
    return { success: false, message: "Authentication failed" };
  }
};

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.tokens;
  console.log(req.headers);
  
  if (!token) {
    res.status(401).send({ message: "No token provided" });
  } else {
    // Token verification logic here
    next();
  }
}
