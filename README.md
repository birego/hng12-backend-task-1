# Number Classification API (ES Modules)

This API classifies a number based on its mathematical properties and returns a fun fact.

## Endpoint
`GET /api/classify-number?number=<number>`

## Parameters
- `number` (required): A positive integer to analyze

## Response Format
The API returns a JSON object with the following properties:
- `number`: The input number
- `is_prime`: Boolean indicating if the number is prime
- `is_perfect`: Boolean indicating if it's a perfect number
- `properties`: Array of mathematical properties (e.g., "armstrong", "odd", "even")
- `digit_sum`: Sum of all digits in the number
- `fun_fact`: An interesting mathematical fact about the number

## Example Request
`GET /api/classify-number?number=371`

## Example Response

{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}


## Error Responses
- 400 Bad Request: If the number parameter is missing or invalid
- 404 Not Found: If the number is out of supported range
- 500 Internal Server Error: For server-side issues

## Rate Limiting
- 100 requests per minute per IP address
- Additional requests will receive a 429 Too Many Requests response