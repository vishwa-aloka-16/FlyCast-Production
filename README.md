# FlyCast Flight Delay Prediction API

**Developer:** Vishwa Aloka Bandara  
**GitHub:** [vishwa-aloka-16](https://github.com/vishwa-aloka-16)  
**API Host:** [https://flycast-api.onrender.com](https://flycast-api.onrender.com)

***

## Overview

**FlyCast** is a RESTful web API that predicts the probability of a flight delay based on airline, schedule, and route information. It is designed for easy integration into travel platforms, analytics dashboards, or airline apps.

***

## Table of Contents

- [Features](#features)
- [Endpoints](#endpoints)
  - [POST /predict](#post-predict)
- [Request and Response Example](#request-and-response-example)
- [Developer Notes](#developer-notes)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contact](#contact)
- [License](#license)

***

## Features

- Predicts flight delay probability (0–1)
- Instant binary delay prediction based on an optimal threshold (default: 0.80)
- Plug-and-play endpoint, no authentication required
- Supports all US airlines/major US airports (expandable)

***

## Endpoints

### `POST /predict`

**Predict the probability of a flight delay given standard flight details.**

- **URL:** `https://flycast-api.onrender.com/predict`
- **Method:** `POST`
- **Headers:**  
  - `Content-Type: application/json`
- **Body Parameters:**

| Name                 | Type    | Required | Description                                    |
|----------------------|---------|----------|------------------------------------------------|
| `AIRLINE`            | string  | Yes      | Airline name or IATA code                      |
| `DAY_OF_WEEK`        | int     | Yes      | Day of week (1=Monday, ..., 7=Sunday)          |
| `DEP_HOUR`           | int     | Yes      | Scheduled departure hour (0-23)                |
| `MONTH`              | int     | Yes      | Month number (1-12)                            |
| `DELAY_DUE_WEATHER`  | int     | No       | 1 if prior weather delay, else 0 (default: 0)  |
| `DELAY_DUE_NAS`      | int     | No       | 1 if prior NAS (airspace) delay, else 0 (def: 0)|
| `DELAY_DUE_CARRIER`  | int     | No       | 1 if prior carrier delay, else 0 (default: 0)  |
| `dep`                | string  | Yes      | IATA code of **departure** airport (e.g., "LAX")|
| `arr`                | string  | Yes      | IATA code of **arrival** airport (e.g., "JFK") |

***

## Request and Response Example

### Example Request

```json
{
  "AIRLINE": "Frontier Airlines Inc.",
  "DAY_OF_WEEK": 3,
  "DEP_HOUR": 10,
  "MONTH": 9,
  "DELAY_DUE_WEATHER": 0,
  "DELAY_DUE_NAS": 0,
  "DELAY_DUE_CARRIER": 0,
  "dep": "LAX",
  "arr": "JFK"
}
```

**cURL Example:**

```sh
curl -X POST https://flycast-api.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"AIRLINE": "Frontier Airlines Inc.", "DAY_OF_WEEK": 3, "DEP_HOUR": 10, "MONTH": 9, "DELAY_DUE_WEATHER": 0, "DELAY_DUE_NAS": 0, "DELAY_DUE_CARRIER": 0, "dep": "LAX", "arr": "JFK"}'
```

### Example Success Response

```json
{
  "delay_probability": 0.4483,
  "prediction": 0
}
```

- `delay_probability`: Probability (0–1) that the flight will be delayed.
- `prediction`: 1 = Delayed (if probability >= 0.8), 0 = On time.

### Example Error Response

```json
{
  "error": "Missing field: AIRLINE"
}
```

***

## Developer Notes

- Send only IATA codes for `dep` and `arr`: e.g., `"JFK"`, `"LAX"`.
- All categorical fields are internally encoded.
- `delay_probability` is a float; `prediction` uses an 0.80 threshold.
- You may omit `DELAY_DUE_WEATHER`, `DELAY_DUE_NAS`, and `DELAY_DUE_CARRIER`—they default to 0.
- Distance between airports is automatically computed; do not include it in requests.
- No authentication is currently required.

***

## Project Structure

```
pred_model/
│
├── flight_prediction_api.py      # API source code (Flask)
├── airport_distances.pkl         # Precomputed airport distance matrix
├── flight_delay_model.pkl        # Serialized ML model
├── model_columns.pkl             # Feature columns for the model
└── requirements.txt              # Python dependencies
```

***

## How It Works

1. **Receives** flight details via POST to `/predict`.
2. **Preprocesses** categorical info (airline, airports).
3. **Looks up** airport-to-airport distance.
4. **Feeds** formatted input to the ML model.
5. **Returns** probability and binary prediction.

### Health Check

- `GET /` — returns a JSON message about running status.

***

## Contact

For bug reports, feature requests, or questions, please contact:

- **Name:** Vishwa Aloka Bandara
- **GitHub:** [vishwa-aloka-16](https://github.com/vishwa-aloka-16)
- *Feel free to create issues or pull requests!*

***

## License

Project is available under [MIT](LICENSE) license.  
See [LICENSE](LICENSE) file for details.

***

**FlyCast — Smart, fast flight delay risk detection.**

---
