
(function() {
var path = require('path');
var hummus = require('hummus');

var fontFile = path.resolve(__dirname, './fonts/Courier.dfont');
console.log('fontFile: ', fontFile);
var filename = path.resolve(__dirname, '../output/EmptyPages.pdf');
var outputFile = path.resolve(__dirname, '../output/EmptyPages22.pdf');

// 创建新文档
var pdfWriter = hummus.createWriter(filename,{version:hummus.ePDFVersion14});

var page = pdfWriter.createPage(0,0,595,842);
pdfWriter.startPageContentContext(page)
  .q()
  .k(57, 0, 100, 0)
  .re(0,0, 595, 842)
  .f()
  .Q()
  //
  .BT()
  .k(0,0,0,1)
  .Tf(pdfWriter.getFontForFile(fontFile,0),1)
  .Tm(30,0,0,30,78.4252,662.8997)
  .Tj('about')
  .ET();

pdfWriter.writePage(page);
pdfWriter.end();


// 修改
var pdfWriter = hummus.createWriterToModify(filename);
var font = pdfWriter.getFontForFile(fontFile,0);

// 合并
// pdfWriter.appendPDFPagesFromPDF(
//   path.resolve(__dirname, '../output/test1_bg.pdf'),
//   {type:hummus.eRangeTypeSpecific,specificRanges:[[0,0]]},
// );
// pdfWriter.appendPDFPagesFromPDF(
//   path.resolve(__dirname, '../output/test1_content.pdf'),
//   {type:hummus.eRangeTypeSpecific,specificRanges:[[0,0]]},
// );
// pdfWriter.end();

var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
pageModifier.startContext().getContext().writeText(
  'Test Text sasdasas  asdds121 \n' + new Date().toLocaleTimeString(),
  75, 805,
  {
    font,
    size:14,colorspace:'gray',color:0x00}
);

pageModifier.endContext();



let ctx = pageModifier.startContext().getContext();

const contentPdf = path.resolve(__dirname, '../output/test1_content.pdf');
// const bgPdf = path.resolve(__dirname, '../output/test1_bg.pdf');

// var contentFormIDs = pdfWriter.createFormXObjectsFromPDF(contentPdf,hummus.ePDFPageBoxMediaBox);
// var bgPdfFormIDs = pdfWriter.createFormXObjectsFromPDF(bgPdf,hummus.ePDFPageBoxMediaBox);

// ctx.q()
//   .cm(0.5,0,0,0.5,0,421)
//   .doXObject(page.getResourcesDictionary().addFormXObjectMapping(bgPdfFormIDs[0]))
// //   .Q();

// ctx.q()
//   .cm(0.5,0,0,0.5,297.5,421)
//   .doXObject(page.getResourcesDictionary().addFormXObjectMapping(contentFormIDs[0]))
//   .Q()


ctx
  .BT()
  .k(0,100,0,1)
  .Tf(font,1)
  .Tm(20,0,0,20,75, 200)
  .Tj('about 111111111111111111a')
  .ET();


// ctx
//   .q()
//   .k(0, 0, 100, 0)
//   .re(0,0, 595, 842)
//   .f()
//   .Q();

pageModifier.endContext();
pageModifier.writePage();

// 复制pdf内容
var copyingContext = pdfWriter.createPDFCopyingContext(contentPdf);
var form = pdfWriter.createFormXObject(0,0,297.5,842);

form.getContentContext().q().cm(0.5,0,0,0.5,0,0);
copyingContext.mergePDFPageToFormXObject(form,0);
form.getContentContext().Q();
pdfWriter.endFormXObject(form);

// var formName = page.getResourcesDictionary().addFormXObjectMapping(form.id);
// console.log('formName: ', formName);

ctx
  .q()
  .doXObject(form)
  .cm(1,0,0,1,297.5,0)
  .doXObject(form)
  .Q();
  
      

pdfWriter.end();

}())