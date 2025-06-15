const express = require('express'); //Imported Express Server
const bodyParser = require('body-parser'); // Parses form Data
const fs = require('fs'); //File system Module
const session = require('express-session'); //Session Management Handling
const PDFKit = require('pdfkit'); // PDF Creation
const bwipjs = require('bwip-js'); //Barcode Generator
const path = require('path'); //Utility for  file paths

// App Configurat\ion
const app = express();
const PORT = process.env.PORT || 5000; // Server PORT Number

// ----------------Middleware Setup----------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'secret-key', //Secret for signing session id cookies
    resave: false,
    saveUninitialized: true,
  })
);

//------------User Credentials HardCoded------------------
const Username = 'test';
const Password = 'test123';

//---------------------Routes-----------------//

//Login Page(GET)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

//Handle User authentication (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === Username && password === Password) {
    req.session.loggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid Login <a href=' / '>Login Again</a>');
  }
});

//Dashboard Page(GET)
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/views/dashboard.html');
  } else {
    res.redirect('/');
  }
});

// PDF Generate/Label Generate/Barcode Generate
app.post('/generate', async (req, res) => {
  const { senderName, senderAddress, receiverName, receiverAddress } = req.body;
  const deliveryID = 'DLV-' + Date.now(); //Unique Delivery Id Genrated

  const doc = new PDFKit();
  //Check if generated folder exists
  const outputDir = path.join(__dirname,'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  //Create File path for new PDF
  const filePath = path.join(outputDir, `${deliveryID}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  //Added Delivery Info to PDF
  doc.fontSize(14).text(`Delivery ID:${deliveryID}`);
  doc.moveDown();
  doc.text(`Sender:${senderName}`);
  doc.moveDown();
  doc.text(senderAddress);
  doc.moveDown();
  doc.text(`Receiver:${receiverName}`);
  doc.moveDown();
  doc.text(receiverAddress);
  doc.moveDown();
  //Generated bar Code for Delivery Id
  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: deliveryID,
      scale: 3,
      height: 10,
      includetext: true,
    });
    doc.image(png, { width: 200 });
  } catch (err) {
    doc.text('Error generating Barcode');
  }
  doc.end();
  //Send File to User after its finished
  stream.on('finish', () => {
    res.download(filePath);
  });
});
//Start Server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
