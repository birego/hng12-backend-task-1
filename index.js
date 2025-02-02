import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
  const { number } = req.query;

  // Input validation
  if (isNaN(number)) {
    return res.status(400).json({ number, error: true });
  }

  const num = parseInt(number, 10);

  // Fetch fun fact from Numbers API
  let funFact = "";
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math`);
    funFact = response.data;
  } catch (error) {
    funFact = "No fun fact available for this number.";
  }

  // Determine properties
  const properties = [];
  if (isArmstrong(num)) properties.push("armstrong");
  if (num % 2 === 0) properties.push("even");
  else properties.push("odd");

  // Prepare response
  const response = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties,
    digit_sum: getDigitSum(num),
    fun_fact: funFact,
  };

  res.status(200).json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});