import express from "express";
import axios from "axios";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiter to prevent abuse (max 100 requests per 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: { error: true, message: "Too many requests, please try again later." },
});
app.use(limiter);

// Helper functions
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isPerfect = (num) => {
  if (num < 2) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num;
};

const isArmstrong = (num) => {
  const digits = String(num).split("");
  const length = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), length), 0);
  return sum === num;
};

const getDigitSum = (num) => {
  return String(num)
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);
};

// API Endpoint
app.get("/api/classify-number", async (req, res) => {
  let { number } = req.query;

  // Strict input validation
  if (!/^-?\d+$/.test(number)) {
    return res.status(400).json({ number, error: true });
  }

  number = Number(number.trim());

  // Prevent extremely large numbers
  if (number > 10 ** 12) {
    return res.status(400).json({ number, error: true, message: "Number too large to process." });
  }

  // Fetch fun fact from Numbers API
  let funFact = "No fun fact available.";
  try {
    const response = await axios.get(`http://numbersapi.com/${number}/math`);
    funFact = response.data.trim();
  } catch (error) {
    console.error("Error fetching fun fact:", error.message);
  }

  // Determine properties
  const properties = [];
  if (isArmstrong(number)) properties.push("armstrong");
  if (number % 2 === 0) properties.push("even");
  else properties.push("odd");

  // Prepare response
  const response = {
    number,
    is_prime: isPrime(number),
    is_perfect: isPerfect(number),
    properties,
    digit_sum: getDigitSum(number),
    fun_fact: funFact,
  };

  res.status(200).json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
