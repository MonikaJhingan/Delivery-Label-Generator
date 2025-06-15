const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const session=require('express-session');
const PDFKit=require('pdfkit');
const bwipjs=require('bwip-js');
const path=require('path');
const { constants } = require('zlib');

const app=express();
const PORT=5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
   secret:'secret-key',
   resave:false,
   saveUninitialized:true,
}));


//User authentication HardCoded
const Username='test';
const Password="test123";

//Login Page
app.get('/',(req,res)=>{
   res.sendFile(__dirname+'/views/login.html')
})

//Handle User authentication
app.post('/login',(req,res)=>{
   const {username,password}=req.body;
   if(username===Username && password===Password){
   req.session.loggedIn=true;
   res.redirect('/dashboard')
   }else{
      res.send('Invalid Login <a href='/'>Login Again</a>');
   }
   } )

   //Dashboard Page
   
app.get('/dashboard',(req,res)=>{
   if(req.session.loggedIn){
   res.sendFile(__dirname+'/views/dashboard.html')
   } else{
      res.redirect('/');
   }
})

// PDF Generate
app.post('/generate',async(req,res)=>{
 const {senderName,senderAddress,receiverName,receiverAddress}=req.body;
 const deliveryID='DLV-'+ Date.now();  //Unique Id

 const doc=new PDFKit();
 const filePath=path.join(__dirname,'generated',`${deliveryID}.pdf`);
 const stream=fs.createWriteStream(filePath);
 doc.pipe(stream);


 doc.fontSize(14).text(`Delivery ID:${deliveryID}`);
 doc.moveDown();
 doc.text(`Sender:${senderName}`);
 doc.moveDown();
 doc.text(senderAddress);
 doc.moveDown();
 doc.text(`Receiver:${receiverName}`); 
 doc.text(receiverAddress);
 doc.moveDown();

 try{
   const png=await bwipjs.toBuffer({
      bcid:'code128',
      text:deliveryID,
      scale:3,
      height:10,
      includetext:true
   })
   doc.image(png,{width:200});
 }catch(err){
   doc.text('Error generating Barcode')
 }
doc.end();

stream.on('finish',()=>{
   res.download(filePath);
})

})
app.listen(PORT,()=>{
   console.log(`Server running on PORT ${PORT}`)
})