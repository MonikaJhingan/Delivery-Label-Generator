# Delivery-Label-Generator

A Minimal web-based dashboard to genrate Delivery labels.
[🔗 Live Demo](https://delivery-label-generator.onrender.com)

## Setup Instructions

### Requirements
- Node.js(v14+)

### 1.Clone the repo
```bash
git clone https://github.com/MonikaJhingan/Delivery-Label-Generator.git
cd Delivery-Label-Generator
```

### 2.Install Dependencies
npm install

### 3.Run the Server
node server.js

-The app wil start on 

```http://localhost:5000```

### 4. Login Credentials
-Username:test
-password:test123

## Working
- Vist login page at `/`
- Submit valid credentials
- Redirected to Dashboard
- Fill sender Receiver Form
- On Clicking Confirm, a PDF label is generated with
   - Sender and Receiver Details
   - Unique Delivery Id
   - Barcode
- Pdf gets downloaded automatically.

## Tech stack
- Node.js
- Express
- pdfkit (pdf generation)
- bwip (barcode)
- express-session
- body-parser

## Deployment Tips
Deployed on Render with production build environment Live link given on top.
