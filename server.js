const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const session=require('express-session');
const PDFKit=require('pdfkit');
const bwipjs=require('bwip-js');
const path=require('path')

const app=express();
const PORT=5000;


