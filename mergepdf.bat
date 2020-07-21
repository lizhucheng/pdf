cd /d D:\ws\pdf\output
node ../src/test1.js
java -jar ..\pdfbox-app-2.0.20.jar PDFSplit -split 1 -startPage 1 -endPage 1 -outputPrefix b .\test1_bg.pdf
java -jar ..\pdfbox-app-2.0.20.jar PDFSplit -split 1 -startPage 1 -endPage 1 -outputPrefix c .\test1_content.pdf

java -jar ..\pdfbox-app-2.0.20.jar OverlayPDF c-1.pdf b-1.pdf merge.pdf

pause