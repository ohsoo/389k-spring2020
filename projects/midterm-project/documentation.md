
# PROJECT NAME

---

Name: Soo Oh

Date: 04/11/2020

Project Topic: Maplestory Item Selling

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Item Name      `Type: String`
- `Field 2`: Item Type      `Type: String`  (equip, use, setup, or etc)
- `Field 3`: Required Job(s)`Type: [String]`
- `Field 4`: Selling Price  `Type: Number`
- `Field 5`: IGN            `Type: String`

Schema: 
```javascript
{
    name: String,
    type: String,
    jobs: [String], 
    price: Number,
    IGN: String
}
```

### 2. Add New Data

HTML form route: `/newlisting`

POST endpoint route: `/api/newlisting`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/newlisting',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
    ign: 'ign', 
    item: 'item',
    jobs: ['job1', 'job2', 'job5'],
    type: 'type',
    price: 1000
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getlistings`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Equips -> `/equips`
2. Use Items -> `/useitems`
3. Setup Items -> `/setupitems`
4. Etc. Items -> `/etcitems`
5. Alphabetical Order -> `/alphabetical`

