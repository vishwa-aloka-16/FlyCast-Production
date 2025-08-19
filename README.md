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
- [Airport/Airline Codes](#airportairline-codes)
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
### AIRPORT/AIRLINE CODES

Codes : 

```js
const airportData = [

 { code: "FLL", name: " Fort Lauderdale–Hollywood International Airport (Fort Lauderdale, FL)" },
 { code: "MSP", name: " Minneapolis–Saint Paul International Airport (Minneapolis–Saint Paul, MN)" },
 { code: "DEN", name: " Denver International Airport (Denver, CO)" },
 { code: "MCO", name: " Orlando International Airport (Orlando, FL)" },
 { code: "DAL", name: " Dallas Love Field (Dallas, TX)" },
 { code: "DCA", name: " Ronald Reagan Washington National Airport (Washington, DC)" },
 { code: "HSV", name: " Huntsville International Airport – Carl T. Jones Field (Huntsville, AL)" },
 { code: "IAH", name: " George Bush Intercontinental Airport (Houston, TX)" },
 { code: "SEA", name: " Seattle–Tacoma International Airport (Seattle, WA)" },
 { code: "ATL", name: " Hartsfield–Jackson Atlanta International Airport (Atlanta, GA)" },
 { code: "RDU", name: " Raleigh–Durham International Airport (Raleigh/Durham, NC)" },
 { code: "MDW", name: " Chicago Midway International Airport (Chicago, IL)" },
 { code: "BDL", name: " Bradley International Airport (Hartford–Springfield region, CT)" },
 { code: "SJC", name: " Norman Y. Mineta San José International Airport (San Jose, CA)" },
 { code: "BWI", name: " Baltimore/Washington International Thurgood Marshall Airport (Baltimore, MD)" },
 { code: "STT", name: " Cyril E. King Airport (St. Thomas, U.S. Virgin Islands)" },
 { code: "SRQ", name: " Sarasota–Bradenton International Airport (Sarasota, FL)" },
 { code: "JFK", name: " John F. Kennedy International Airport (New York, NY)" },
 { code: "GRR", name: " Gerald R. Ford International Airport (Grand Rapids, MI)" },
 { code: "DFW", name: " Dallas/Fort Worth International Airport (Dallas–Fort Worth, TX)" },
 { code: "CLT", name: " Charlotte Douglas International Airport (Charlotte, NC)" },
 { code: "ORD", name: " O'Hare International Airport (Chicago, IL)" },
 { code: "LAS", name: " Las Vegas McCarran/Louis Reid International Airport (Las Vegas, NV)" },
 { code: "TUL", name: " Tulsa International Airport (Tulsa, OK)" },
 { code: "USA", name: " (No IATA code; possibly a placeholder or country code—not applicable)" },
 { code: "SLC", name: " Salt Lake City International Airport (Salt Lake City, UT)" },
 { code: "BNA", name: " Nashville International Airport (Nashville, TN)" },
 { code: "AUS", name: " Austin–Bergstrom International Airport (Austin, TX)" },
 { code: "IND", name: " Indianapolis International Airport (Indianapolis, IN)" },
 { code: "MHT", name: " Manchester–Boston Regional Airport (Manchester, NH)" },
 { code: "SFO", name: " San Francisco International Airport (San Francisco, CA)" },
 { code: "PRC", name: " Ernest A. Love Field (Prescott, AZ)" },
 { code: "BOS", name: " Logan International Airport (Boston, MA)" },
 { code: "LAX", name: " Los Angeles International Airport (Los Angeles, CA)" },
 { code: "SMF", name: " Sacramento International Airport (Sacramento, CA)" },
 { code: "DTW", name: " Detroit Metropolitan Wayne County Airport (Detroit, MI)" },
 { code: "SAT", name: " San Antonio International Airport (San Antonio, TX)" },
 { code: "MSY", name: " Louis Armstrong New Orleans International Airport (New Orleans, LA)" },
 { code: "CMH", name: " John Glenn Columbus International Airport (Columbus, OH)" },
 { code: "STL", name: " Lambert–St. Louis International Airport (St. Louis, MO)" },
 { code: "SJU", name: " Luis Muñoz Marín International Airport (San Juan, Puerto Rico)" },
 { code: "PHX", name: " Phoenix Sky Harbor International Airport (Phoenix, AZ)" },
 { code: "TPA", name: " Tampa International Airport (Tampa, FL)" },
 { code: "LGA", name: " LaGuardia Airport (New York, NY)" },
 { code: "PHL", name: " Philadelphia International Airport (Philadelphia, PA)" },
 { code: "GRK", name: " Robert Gray Army Airfield (Fort Hood – Killeen/Temple, TX)" },
 { code: "ILM", name: " Wilmington International Airport (Wilmington, NC)" },
 { code: "JLN", name: " Joplin Regional Airport (Joplin, MO)" },
 { code: "MKE", name: " Milwaukee Mitchell International Airport (Milwaukee, WI)" },
 { code: "BIL", name: " Billings Logan International Airport (Billings, MT)" },
 { code: "BLI", name: " Bellingham International Airport (Bellingham, WA)" },
 { code: "CHS", name: " Charleston International Airport (Charleston, SC)" },
 { code: "RIC", name: " Richmond International Airport (Richmond, VA)" },
 { code: "GSO", name: " Piedmont Triad International Airport (Greensboro/Winston-Salem/High Point, NC)" },
 { code: "MCI", name: " Kansas City International Airport (Kansas City, MO)" },
 { code: "EWR", name: " Newark Liberty International Airport (Newark, NJ)" },
 { code: "ELP", name: " El Paso International Airport (El Paso, TX)" },
 { code: "SDF", name: " Louisville Muhammad Ali International Airport (Louisville, KY)" },
 { code: "HPN", name: " Westchester County Airport (White Plains, NY)" },
 { code: "SAN", name: " San Diego International Airport (San Diego, CA)" },
 { code: "BHM", name: " Birmingham–Shuttlesworth International Airport (Birmingham, AL)" },
 { code: "ASE", name: " Aspen/Pitkin County Airport (Aspen, CO)" },
 { code: "HNL", name: " Daniel K. Inouye International Airport (Honolulu, HI)" },
 { code: "MAF", name: " Midland International Air & Space Port (Midland/Odessa, TX)" },
 { code: "BUF", name: " Buffalo Niagara International Airport (Buffalo, NY)" },
 { code: "TUS", name: " Tucson International Airport (Tucson, AZ)" },
 { code: "SYR", name: " Syracuse Hancock International Airport (Syracuse, NY)" },
 { code: "MSN", name: " Dane County Regional Airport (Madison, WI)" },
 { code: "FAT", name: " Fresno Yosemite International Airport (Fresno, CA)" },
 { code: "FWA", name: " Fort Wayne International Airport (Fort Wayne, IN)" },
 { code: "LAN", name: " Capital Region International Airport (Lansing, MI)" },
 { code: "ABI", name: " Abilene Regional Airport (Abilene, TX)" },
 { code: "ICT", name: " Wichita Dwight D. Eisenhower National Airport (Wichita, KS)" },
 { code: "CMI", name: " University of Illinois Willard Airport (Champaign/Urbana, IL)" },
 { code: "IAD", name: " Washington Dulles International Airport (Dulles, VA)" },
 { code: "OAK", name: " Metropolitan Oakland International Airport (Oakland, CA)" },
 { code: "EUG", name: " Eugene Airport (Eugene, OR)" },
 { code: "MIA", name: " Miami International Airport (Miami, FL)" },
 { code: "CHA", name: " Chattanooga Metropolitan Airport (Chattanooga, TN)" },
 { code: "BTV", name: " Burlington International Airport (Burlington, VT)" },
 { code: "RSW", name: " Southwest Florida International Airport (Fort Myers, FL)" },
 { code: "PDX", name: " Portland International Airport (Portland, OR)" },
 { code: "SNA", name: " John Wayne Airport (Santa Ana/Orange County, CA)" },
 { code: "PIT", name: " Pittsburgh International Airport (Pittsburgh, PA)" },
 { code: "OGG", name: " Kahului Airport (Maui, HI)" },
 { code: "HRL", name: " Valley International Airport (Harlingen, TX)" },
 { code: "BIS", name: " Bismarck Municipal Airport (Bismarck, ND)" },
 { code: "SHR", name: " Sheridan County Airport (Sheridan, WY)" },
 { code: "BOI", name: " Boise Airport (Boise, ID)" },
 { code: "RNO", name: " Reno–Tahoe International Airport (Reno, NV)" },
 { code: "SBP", name: " San Luis County Regional Airport (San Luis Obispo, CA)" },
 { code: "GSP", name: " Greenville–Spartanburg International Airport (Greenville/Spartanburg, SC)" },
 { code: "MLB", name: " Melbourne Orlando International Airport (Melbourne, FL)" },
 { code: "GRB", name: " Austin Straubel International Airport (Green Bay, WI)" },
 { code: "CRW", name: " Yeager Airport (Charleston, WV)" },
 { code: "LGB", name: " Long Beach Airport (Long Beach, CA)" },
 { code: "OKC", name: " Will Rogers World Airport (Oklahoma City, OK)" },
 { code: "PVD", name: " T.F. Green International Airport (Providence, RI)" },
 { code: "YAK", name: " Yakutat Airport (Yakutat, AK)" },
 { code: "CID", name: " The Eastern Iowa Airport (Cedar Rapids, IA)" },
 { code: "FSD", name: " Sioux Falls Regional Airport (Sioux Falls, SD)" },
 { code: "HYS", name: " Hays Regional Airport (Hays, KS)" },
 { code: "VPS", name: " Destin–Fort Walton Beach Airport (Valparaiso, FL)" },
 { code: "ROC", name: " Greater Rochester International Airport (Rochester, NY)" },
 { code: "SAV", name: " Savannah/Hilton Head International Airport (Savannah, GA)" },
 { code: "CLE", name: " Cleveland Hopkins International Airport (Cleveland, OH)" },
 { code: "RDD", name: " Redding Municipal Airport (Redding, CA)" },
 { code: "ANC", name: " Ted Stevens Anchorage International Airport (Anchorage, AK)" },
 { code: "DVL", name: " Devils Lake Regional Airport (Devils Lake, ND)" },
 { code: "SWO", name: " Stillwater Regional Airport (Stillwater, OK)" },
 { code: "BUR", name: " Hollywood Burbank Airport (Burbank, CA)" },
 { code: "PIR", name: " Pierre Regional Airport (Pierre, SD)" },
 { code: "HOU", name: " William P. Hobby Airport (Houston, TX)" },
 { code: "PBI", name: " Palm Beach International Airport (West Palm Beach, FL)" },
 { code: "MLI", name: " Quad City International Airport (Moline/Davenport, IL)" },
 { code: "AZA", name: " Phoenix–Mesa Gateway Airport (Phoenix, AZ)" },
 { code: "MKG", name: " Muskegon County Airport (Muskegon, MI)" },
 { code: "PNS", name: " Pensacola International Airport (Pensacola, FL)" },
 { code: "MYR", name: " Myrtle Beach International Airport (Myrtle Beach, SC)" },
 { code: "GTF", name: " Great Falls International Airport (Great Falls, MT)" },
 { code: "LSE", name: " La Crosse Regional Airport (La Crosse, WI)" },
 { code: "RDM", name: " Roberts Field (Redmond/Bend, OR)" },
 { code: "ORF", name: " Norfolk International Airport (Norfolk, VA)" },
 { code: "KOA", name: " Ellison Onizuka Kona International Airport (Kona, HI)" },
 { code: "MQT", name: " Sawyer International Airport (Marquette, MI)" },
 { code: "COS", name: " Colorado Springs Airport (Colorado Springs, CO)" },
 { code: "CVG", name: " Cincinnati/Northern Kentucky International Airport (Cincinnati area, KY/OH)" },
 { code: "MOB", name: " Mobile Regional Airport (Mobile, AL)" },
 { code: "AVL", name: " Asheville Regional Airport (Asheville, NC)" },
 { code: "BTR", name: " Baton Rouge Metropolitan Airport (Baton Rouge, LA)" },
 { code: "JNU", name: " Juneau International Airport (Juneau, AK)" },
 { code: "CDC", name: " Cedar City Regional Airport (Cedar City, UT)" },
 { code: "SPS", name: " Wichita Falls Municipal Airport (Sheppard AFB/Wichita Falls, TX)" },
 { code: "ECP", name: " Northwest Florida Beaches International Airport (Panama City, FL)" },
 { code: "JAX", name: " Jacksonville International Airport (Jacksonville, FL)" },
 { code: "SBN", name: " South Bend International Airport (South Bend, IN)" },
 { code: "SBA", name: " Santa Barbara Municipal Airport (Santa Barbara, CA)" },
 { code: "RAP", name: " Rapid City Regional Airport (Rapid City, SD)" },
 { code: "AMA", name: " Rick Husband Amarillo International Airport (Amarillo, TX)" },
 { code: "JMS", name: " Jamestown Regional Airport (Jamestown, ND)" },
 { code: "SFB", name: " Orlando Sanford International Airport (Sanford, FL)" },
 { code: "ABQ", name: " Albuquerque International Sunport (Albuquerque, NM)" },
 { code: "ALB", name: " Albany International Airport (Albany, NY)" },
 { code: "BGM", name: " Greater Binghamton Airport (Binghamton, NY)" },
 { code: "MGM", name: " Montgomery Regional Airport (Montgomery, AL)" },
 { code: "MEM", name: " Memphis International Airport (Memphis, TN)" },
 { code: "ONT", name: " Ontario International Airport (Ontario, CA)" },
 { code: "TVC", name: " Cherry Capital Airport (Traverse City, MI)" },
 { code: "GEG", name: " Spokane International Airport (Spokane, WA)" },
 { code: "OMA", name: " Eppley Airfield (Omaha, NE)" },
 { code: "ISP", name: " Long Island MacArthur Airport (Islip, NY)" },
 { code: "DLH", name: " Duluth International Airport (Duluth, MN)" },
 { code: "PIE", name: " St. Pete–Clearwater International Airport (St. Petersburg/Clearwater, FL)" },
 { code: "PSP", name: " Palm Springs International Airport (Palm Springs, CA)" },
 { code: "ACY", name: " Atlantic City International Airport (Pomona, NJ)" },
 { code: "BJI", name: " Bemidji Regional Airport (Bemidji, MN)" },
 { code: "LBB", name: " Lubbock Preston Smith International Airport (Lubbock, TX)" },
 { code: "SHV", name: " Shreveport Regional Airport (Shreveport, LA)" },
 { code: "TTN", name: " Trenton–Mercer Airport (Trenton, NJ)" },
 { code: "PIA", name: " Greater Peoria Regional Airport (Peoria, IL)" },
 { code: "GNV", name: " Gainesville Regional Airport (Gainesville, FL)" },
 { code: "PWM", name: " Portland International Jetport (Portland, ME)" },
 { code: "BZN", name: " Bozeman Yellowstone International Airport (Bozeman, MT)" },
 { code: "BRW", name: " Wiley Post–Will Rogers Memorial Airport (Utqiaġvik/Barrow, AK)" },
 { code: "MFR", name: " Rogue Valley International–Medford Airport (Medford, OR)" },
 { code: "GPT", name: " Gulfport–Biloxi International Airport (Gulfport/Biloxi, MS)" },
 { code: "ATW", name: " Appleton International Airport (Appleton, WI)" },
 { code: "DSM", name: " Des Moines International Airport (Des Moines, IA)" },
 { code: "CKB", name: " North Central West Virginia Airport (Clarksburg, WV)" },
 { code: "SGU", name: " St. George Regional Airport (St. George, UT)" },
 { code: "OTZ", name: " Ralph Wien Memorial Airport (Kotzebue, AK)" },
 { code: "BGR", name: " Bangor International Airport (Bangor, ME)" },
 { code: "XNA", name: " Northwest Arkansas National Airport (Fayetteville/Springdale, AR)" },
 { code: "CAE", name: " Columbia Metropolitan Airport (Columbia, SC)" },
 { code: "SGF", name: " Springfield–Branson National Airport (Springfield, MO)" },
 { code: "PGD", name: " Punta Gorda Airport (Punta Gorda, FL)" },
 { code: "VLD", name: " Valdosta Regional Airport (Valdosta, GA)" },
 { code: "CPR", name: " Casper/Natrona County International Airport (Casper, WY)" },
 { code: "LIH", name: " Lihue Airport (Lihue, HI)" },
 { code: "JAN", name: " Jackson–Evers International Airport (Jackson, MS)" },
 { code: "ACT", name: " Waco Regional Airport (Waco, TX)" },
 { code: "OAJ", name: " Albert J. Ellis Airport (Jacksonville, NC)" },
 { code: "ABE", name: " Lehigh Valley International Airport (Allentown, PA)" },
 { code: "EGE", name: " Eagle County Regional Airport (Eagle, CO)" },
 { code: "CRP", name: " Corpus Christi International Airport (Corpus Christi, TX)" },
 { code: "FNT", name: " Bishop International Airport (Flint, MI)" },
 { code: "WRG", name: " Wrangell Airport (Wrangell, AK)" },
 { code: "FCA", name: " Glacier Park International Airport (Kalispell, MT)" },
 { code: "CHO", name: " Charlottesville Albemarle Airport (Charlottesville, VA)" },
 { code: "MRY", name: " Monterey Regional Airport (Monterey, CA)" },
 { code: "SCE", name: " University Park Airport (State College, PA)" },
 { code: "AEX", name: " Alexandria International Airport (Alexandria, LA)" },
 { code: "MCW", name: " Mason City Municipal Airport (Mason City, IA)" },
 { code: "RST", name: " Rochester International Airport (Rochester, MN)" },
 { code: "SIT", name: " Sitka Rocky Gutierrez Airport (Sitka, AK)" },
 { code: "BMI", name: " Central Illinois Regional Airport (Bloomington, IL)" },
 { code: "ACV", name: " Arcata/Eureka Airport (Arcata, CA)" },
 { code: "GCC", name: " Gillette–Campbell County Airport (Gillette, WY)" },
 { code: "LFT", name: " Lafayette Regional Airport (Lafayette, LA)" },
 { code: "ITO", name: " Hilo International Airport (Hilo, HI)" },
 { code: "ABY", name: " Southwest Georgia Regional Airport (Albany, GA)" },
 { code: "GRI", name: " Central Nebraska Regional Airport (Grand Island, NE)" },
 { code: "BPT", name: " Jack Brooks Regional Airport (Beaumont/Port Arthur, TX)" },
 { code: "APN", name: " Alpena County Regional Airport (Alpena, MI)" },
 { code: "TLH", name: " Tallahassee International Airport (Tallahassee, FL)" },
 { code: "FSM", name: " Fort Smith Regional Airport (Fort Smith, AR)" },
 { code: "ALO", name: " Waterloo Regional Airport (Waterloo, IA)" },
 { code: "FAY", name: " Fayetteville Regional Airport (Fayetteville, NC)" },
 { code: "GJT", name: " Grand Junction Regional Airport (Grand Junction, CO)" },
 { code: "IAG", name: " Niagara Falls International Airport (Niagara Falls, NY)" },
 { code: "FLG", name: " Flagstaff Pulliam Airport (Flagstaff, AZ)" },
 { code: "LBE", name: " Arnold Palmer Regional Airport (Latrobe/Greensburg, PA)" },
 { code: "CAK", name: " Akron–Canton Airport (Akron/Canton, OH)" },
 { code: "BFL", name: " Meadows Field Airport (Bakersfield, CA)" },
 { code: "VEL", name: " Vernal Regional Airport (Vernal, UT)" },
 { code: "LIT", name: " Bill and Hillary Clinton National Airport (Little Rock, AR)" },
 { code: "STX", name: " Henry E. Rohlsen Airport (St. Croix, U.S. Virgin Islands)" },
 { code: "TYS", name: " McGhee Tyson Airport (Knoxville, TN)" },
 { code: "EYW", name: " Key West International Airport (Key West, FL)" },
 { code: "AVP", name: " Wilkes-Barre/Scranton International Airport (Scranton/Wilkes-Barre, PA)" },
 { code: "KTN", name: " Ketchikan International Airport (Ketchikan, AK)" },
 { code: "EVV", name: " Evansville Regional Airport (Evansville, IN)" },
 { code: "BRO", name: " Brownsville South Padre Island International Airport (Brownsville, TX)" },
 { code: "SWF", name: " Stewart International Airport (Newburgh, NY)" },
 { code: "GGG", name: " East Texas Regional Airport (Longview/Kilgore, TX)" },
 { code: "MSO", name: " Missoula International Airport (Missoula, MT)" },
 { code: "PSC", name: " Tri-Cities Airport (Pasco/Kennewick/Richland, WA)" },
 { code: "SLN", name: " Salina Regional Airport (Salina, KS)" },
 { code: "BIH", name: " Bishop International Airport (Flint, MI)" },
 { code: "MLU", name: " Monroe Regional Airport (Monroe, LA)" },
 { code: "HOB", name: " Lea County Regional Airport (Hobbs, NM)" },
 { code: "DAY", name: " James M. Cox Dayton International Airport (Dayton, OH)" },
 { code: "DBQ", name: " Dubuque Regional Airport (Dubuque, IA)" },
 { code: "ROW", name: " Roswell International Air Center (Roswell, NM)" },
 { code: "LEX", name: " Blue Grass Airport (Lexington, KY)" },
 { code: "PIH", name: " Pocatello Regional Airport (Pocatello, ID)" },
 { code: "EWN", name: " Coastal Carolina Regional Airport (New Bern, NC)" },
 { code: "ESC", name: " Delta County Airport (Escanaba, MI)" },
 { code: "SUX", name: " Sioux Gateway Airport (Sioux City, IA)" },
 { code: "PAE", name: " Snohomish County Airport (Paine Field, Everett, WA)" },
 { code: "CNY", name: " Moab Regional Airport (Moab, UT)" },
 { code: "CDV", name: " Kodiak Airport (Kodiak, AK)" },
 { code: "COU", name: " Columbia Regional Airport (Columbia, MO)" },
 { code: "LBF", name: " North Platte Regional Airport (North Platte, NE)" },
 { code: "MFE", name: " McAllen Miller International Airport (McAllen, TX)" },
 { code: "PBG", name: " Plattsburgh International Airport (Plattsburgh, NY)" },
 { code: "PSE", name: " Merced Regional Airport (Merced, CA)" },
 { code: "LAR", name: " Laramie Regional Airport (Laramie, WY)" },
 { code: "FAI", name: " Fairbanks International Airport (Fairbanks, AK)" },
 { code: "SCC", name: " Deadhorse Airport (Deadhorse, AK)" },
 { code: "MTJ", name: " Montrose Regional Airport (Montrose, CO)" },
 { code: "SJT", name: " San Angelo Regional Airport (San Angelo, TX)" },
 { code: "AGS", name: " Augusta Regional Airport (Bush Field)" },
 { code: "MDT", name: " Harrisburg International Airport (Harrisburg, PA)" },
 { code: "ELM", name: " Elmira/Corning Regional Airport (Elmira, NY)" },
 { code: "HDN", name: " Yampa Valley Airport (Hayden, CO)" },
 { code: "CWA", name: " Central Wisconsin Airport (Mosinee, WI)" },
 { code: "MOT", name: " Minot International Airport (Minot, ND)" },
 { code: "IDA", name: " Idaho Falls Regional Airport (Idaho Falls, ID)" },
 { code: "FAR", name: " Hector International Airport (Fargo, ND)" },
 { code: "GFK", name: " Grand Forks International Airport (Grand Forks, ND)" },
 { code: "JAC", name: " Jackson Hole Airport (Jackson, WY)" },
 { code: "LAW", name: " Lawton–Fort Sill Regional Airport (Lawton, OK)" },
 { code: "SUN", name: " Friedman Memorial Airport (Hailey/Ketchum, ID)" },
 { code: "IMT", name: " Ford Airport (Iron Mountain, MI)" },
 { code: "LCH", name: " Lake Charles Regional Airport (Lake Charles, LA)" },
 { code: "CLL", name: " Easterwood Airport (College Station, TX)" },
 { code: "PHF", name: " Newport News/Williamsburg International Airport (Newport News, VA)" },
 { code: "TRI", name: " Tri-Cities Regional Airport (Blountville/Johnson City, TN)" },
 { code: "BET", name: " Bethel Airport (Bethel, AK)" },
 { code: "BQN", name: " Rafael Hernández International Airport (Aguadilla, Puerto Rico)" },
 { code: "BRD", name: " Brainerd Lakes Regional Airport (Brainerd, MN)" },
 { code: "DAB", name: " Daytona Beach International Airport (Daytona Beach, FL)" },
 { code: "DRO", name: " Durango–La Plata County Airport (Durango, CO)" },
 { code: "STS", name: " Charles M. Schulz–Sonoma County Airport (Santa Rosa, CA)" },
 { code: "ROA", name: " Roanoke–Blacksburg Regional Airport (Roanoke, VA)" },
 { code: "DDC", name: " Dodge City Regional Airport (Dodge City, KS)" },
 { code: "INL", name: " Falls International Airport (International Falls, MN)" },
 { code: "ORH", name: " Worcester Regional Airport (Worcester, MA)" },
 { code: "TXK", name: " Texarkana Regional Airport (Texarkana, AR/TX)" },
 { code: "BFF", name: " Western Nebraska Regional Airport (Scottsbluff, NE)" },
 { code: "DHN", name: " Dothan Regional Airport (Dothan, AL)" }, 
 { code: "SCK", name: " Stockton Metropolitan Airport (Stockton, CA)" },
 { code: "LRD", name: " Laredo International Airport (Laredo, TX)" },
 { code: "BTM", name: " Bert Mooney Airport (Butte, MT)" },
 { code: "IPT", name: " Williamsport Regional Airport (Williamsport, PA)" },
 { code: "PIB", name: " Hattiesburg–Laurel Regional Airport (Hattiesburg/Laurel, MS)" },
 { code: "HYA", name: " Barnstable Municipal Airport (Hyannis, MA)" },
 { code: "PVU", name: " Provo Municipal Airport (Provo, UT)" },
 { code: "LBL", name: " Liberal Mid-America Regional Airport (Liberal, KS)" },
 { code: "AZO", name: " Kalamazoo/Battle Creek International Airport (Kalamazoo, MI)" },
 { code: "ACK", name: " Nantucket Memorial Airport (Nantucket, MA)" },
 { code: "YUM", name: " Yuma International Airport (Yuma, AZ)" },
 { code: "DRT", name: " Del Rio International Airport (Del Rio, TX)" },
 { code: "COD", name: " Yellowstone Regional Airport (Cody, WY)" },
 { code: "LNK", name: " Lincoln Airport (Lincoln, NE)" },
 { code: "SHD", name: " Shenandoah Valley Regional Airport (Staunton, VA)" },
 { code: "CIU", name: " Chippewa County International Airport (Sault Ste. Marie, MI)" },
 { code: "HLN", name: " Helena Regional Airport (Helena, MT)" },
 { code: "LWB", name: " Greenbrier Valley Airport (Lewisburg, WV)" },
 { code: "MEI", name: " Meridian Regional Airport (Meridian, MS)" },
 { code: "SAF", name: " Santa Fe Regional Airport (Santa Fe, NM)" },
 { code: "CYS", name: " Cheyenne Regional Airport (Cheyenne, WY)" },
 { code: "ABR", name: " Aberdeen Regional Airport (Aberdeen, SD)" },
 { code: "LCK", name: " Rickenbacker International Airport (Columbus, OH)" },
 { code: "RKS", name: " Rock Springs–Sweetwater County Airport (Rock Springs, WY)" },
 { code: "GCK", name: " Garden City Regional Airport (Garden City, KS)" },
 { code: "LWS", name: " Lewiston–Nez Perce County Airport (Lewiston, ID)" },
 { code: "EAR", name: " Kearney Regional Airport (Kearney, NE)" },
 { code: "GTR", name: " Golden Triangle Regional Airport (Columbus/Starkville/West Point, MS)" },
 { code: "CSG", name: " Columbus Metropolitan Airport (Columbus, GA)" },
 { code: "RFD", name: " Chicago Rockford International Airport (Rockford, IL)" },
 { code: "ADQ", name: " Kodiak Airport (Kodiak, AK)" },
 { code: "BLV", name: " Scott Air Force Base MidAmerica Airport (Belleville/St. Louis, IL)" },
 { code: "TYR", name: " Tyler Pounds Regional Airport (Tyler, TX)" },
 { code: "CMX", name: " Houghton County Memorial Airport (Houghton, MI)" },
 { code: "PAH", name: " Barkley Regional Airport (Paducah, KY)" },
 { code: "JST", name: " John Murtha Johnstown–Cambria County Airport (Johnstown, PA)" },
 { code: "TOL", name: " Toledo Express Airport (Toledo, OH)" },
 { code: "PSG", name: " Petersburg James A. Johnson Airport (Petersburg, AK)" },
 { code: "MHK", name: " Manhattan Regional Airport (Manhattan, KS)" },
 { code: "YKM", name: " Yakima Air Terminal (Yakima, WA)" },
 { code: "EAT", name: " Pangborn Memorial Airport (Wenatchee, WA)" },
 { code: "SPI", name: " Abraham Lincoln Capital Airport (Springfield, IL)" },
 { code: "BQK", name: " Brunswick Executive Airport (Brunswick, ME)" },
 { code: "TWF", name: " Twin Falls Airport (Twin Falls, ID)" },
 { code: "PUB", name: " Pueblo Memorial Airport (Pueblo, CO)" },
 { code: "DEC", name: " Decatur Airport (Decatur, IL)" },
 { code: "HHH", name: " Hilton Head Airport (Hilton Head, SC)" },
 { code: "PLN", name: " Pellston Regional Airport (Pellston, MI)" },
 { code: "HIB", name: " Chisholm-Hibbing Airport (Hibbing, MN)" },
 { code: "GUC", name: " Gunnison–Crested Butte Regional Airport (Gunnison, CO)" },
 { code: "ITH", name: " Ithaca Tompkins Regional Airport (Ithaca, NY)" },
 { code: "OME", name: " Nome Airport (Nome, AK)" },
 { code: "MBS", name: " MBS International Airport (Saginaw/Bay City/Midland, MI)" },
 { code: "BFM", name: " Mobile Downtown Airport (Mobile, AL)" }, 
 { code: "LYH", name: " Lynchburg Regional Airport (Lynchburg, VA)" },
 { code: "RHI", name: " Rhinelander–Oneida County Airport (Rhinelander, WI)" },
 { code: "ALW", name: " Walla Walla Regional Airport (Walla Walla, WA)" },
 { code: "DLG", name: " Dillingham Airport (Dillingham, AK)" },
 { code: "ALS", name: " San Luis Valley Regional Airport (Alamosa, CO)" },
 { code: "MMH", name: " Mammoth Yosemite Airport (Mammoth Lakes, CA)" },
 { code: "XWA", name: " Williston Basin International Airport (Williston, ND)" },
 { code: "SPN", name: " Saipan International Airport (Saipan, Northern Mariana Islands)" },
 { code: "MVY", name: " Martha’s Vineyard Airport (Edgartown, MA)" },
 { code: "ERI", name: " Erie International Tom Ridge Field (Erie, PA)" },
 { code: "PGV", name: " Pitt–Greenville Airport (Greenville, NC)" },
 { code: "HGR", name: " Hagerstown Regional Airport (Hagerstown, MD)" },
 { code: "ATY", name: " Watertown International Airport (Watertown, SD)" },
 { code: "SMX", name: " Santa Maria Public Airport (Santa Maria, CA)" },
 { code: "HVN", name: " Tweed New Haven Airport (New Haven, CT)" },
 { code: "CGI", name: " Cape Girardeau Regional Airport (Cape Girardeau, MO)" },
 { code: "BKG", name: " Branson Airport (Branson, MO)" },
 { code: "DIK", name: " Dickinson Theodore Roosevelt Regional Airport (Dickinson, ND)" },
 { code: "AKN", name: " King Salmon Airport (King Salmon, AK)" }, 
 { code: "RIW", name: " Riverton Regional Airport (Riverton, WY)" },
 { code: "FLO", name: " Florence Regional Airport (Florence, SC)" },
 { code: "GUM", name: " Antonio B. Won Pat International Airport (Guam)" },
 { code: "EAU", name: " Chippewa Valley Regional Airport (Eau Claire, WI)" },
 { code: "TBN", name: " Waynesville–St. Robert Regional Airport (Fort Leonard Wood, MO)" },
 { code: "HTS", name: " Tri-State Airport (Huntington, WV)" },
 { code: "PSM", name: " Portsmouth International Airport at Pease (Portsmouth, NH)" },
 { code: "EKO", name: " Elko Regional Airport (Elko, NV)" },
 { code: "PUW", name: " Pullman–Moscow Regional Airport (Pullman/Moscow, WA)" },
 { code: "FOD", name: " RNAS Fallon / Fallon Airfield (Fallon, NV)" },
 { code: "CDB", name: " Cold Bay Airport (Cold Bay, AK)" },
 { code: "WYS", name: " Yellowstone Airport (West Yellowstone, MT)" },
 { code: "OTH", name: " Southwest Oregon Regional Airport (North Bend/Coos Bay, OR)" },
 { code: "VCT", name: " Victoria Regional Airport (Victoria, TX)" },
 { code: "PPG", name: " Pago Pago International Airport (Pago Pago, American Samoa)" },
 { code: "OGS", name: " Ogdensburg International Airport (Ogdensburg, NY)" },
 { code: "ISN", name: " Williston Basin Code (duplicate)" },
 { code: "ART", name: " Watertown Municipal Airport (Watertown, SD)" }, 
 { code: "ILG", name: " Wilmington Airport (Wilmington, DE)" },
 { code: "OWB", name: " Owensboro–Daviess County Airport (Owensboro, KY)" },
 { code: "OGD", name: " Ogden–Hinckley Airport (Ogden, UT)" },
 { code: "STC", name: " St. Cloud Regional Airport (St. Cloud, MN)" },
 { code: "UIN", name: " Quincy Regional Airport (Quincy, IL)" },
 { code: "GST", name: " Gustavus Airport (Gustavus, AK)" },
 { code: "ADK", name: " Adak Airport (Adak, AK)" },
];

const airlineData = [
  {name: "United Air Lines Inc.", logo: "https://logo.clearbit.com/united.com"},
  {name: "Delta Air Lines Inc.", logo: "https://logo.clearbit.com/delta.com"},
  {name: "Spirit Air Lines", logo: "https://logo.clearbit.com/spirit.com"},
  {name: "Southwest Airlines Co.", logo: "https://logo.clearbit.com/southwest.com"},
  {name: "American Airlines Inc.", logo: "https://logo.clearbit.com/aa.com"},
  {name: "Republic Airline", logo: "https://logo.clearbit.com/rjet.com"},
  {name: "Alaska Airlines Inc.", logo: "https://logo.clearbit.com/alaskaair.com"},
  {name: "JetBlue Airways", logo: "https://logo.clearbit.com/jetblue.com"},
  {name: "PSA Airlines Inc.", logo: "https://logo.clearbit.com/psaairlines.com"},
  {name: "Allegiant Air", logo: "https://logo.clearbit.com/allegiantair.com"},
  {name: "ExpressJet Airlines LLC d/b/a aha!", logo: "https://logo.clearbit.com/aha-air.com"},
  {name: "SkyWest Airlines Inc.", logo: "https://logo.clearbit.com/skywest.com"},
  {name: "Endeavor Air Inc.", logo: "https://logo.clearbit.com/endeavorair.com"},
  {name: "Envoy Air", logo: "https://logo.clearbit.com/envoyair.com"},
  {name: "Frontier Airlines Inc.", logo: "https://logo.clearbit.com/flyfrontier.com"},
  {name: "Mesa Airlines Inc.", logo: "https://logo.clearbit.com/mesa-air.com"},
  {name: "Horizon Air", logo: "https://logo.clearbit.com/horizonair.com"},
  {name: "Hawaiian Airlines Inc.", logo: "https://logo.clearbit.com/hawaiianairlines.com"}
];
```

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
