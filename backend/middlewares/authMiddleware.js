import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate a strong secret key using a secure CSPRNG
const secretKey = crypto.randomBytes(32).toString("hex");

export const generateToken = (userId, userRole) => {
  const payload = {
    userId,
    userRole,
    iat: Math.floor(Date.now() / 1000), // Issued at time (in seconds)
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expiration time (1 hour from now)
    iss: "your-app-domain.com", // Issuer (your application domain or identifier)
  };

  return jwt.sign(payload, secretKey, {
    algorithm: "HS256", // Explicitly specify the algorithm
  });
};





// import jwt from "jsonwebtoken";

// const secretKey = process.env.SECRET_KEY;

// export const generateToken = (userId, userRole) => {
//   return jwt.sign({ userId, userRole }, secretKey, {
//     expiresIn: "1hr",
//   });
// };