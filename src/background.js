const fs = require('fs');
const path = require('path');

const PDFAssembler = require('pdfassembler').PDFAssembler;

const binaryPDF =  fs.readFileSync(
  path.resolve(__dirname, '../output/test1_bg.pdf'),
);
const newPdf = new PDFAssembler(binaryPDF);
console.log(typeof newPdf);

newPdf
  .getPDFStructure()
  .then(function(pdf) {
    const str = JSON.stringify(pdf, null, 2);
    console.log('typeof pdf: ', typeof pdf);
    fs.writeFileSync(path.resolve(__dirname, '../output/pdf.json', str));
    // pdf['/Root']['/Pages']['/Kids'].splice(1);
  });