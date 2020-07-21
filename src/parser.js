const fs = require('fs');
const path = require('path');
const hummus = require('hummus');

function parse(inputPDF) {
  var mTabLevel = 0;
  var mIteratedObjectIDs = {};
  var logFile = path.resolve(__dirname, '../output/parseLog.txt');
  console.log('logFile: ', logFile);
  var outputFile = fs.openSync(logFile,'w');
  function logToFile(inString) {
    fs.writeSync(outputFile,addTabs() + inString + '\r\n');
  }

  function addTabs() {
    var output='';
    for (var i=0;i<mTabLevel;++i) {
      output+=' ';
    }
    return output;
  }

  function iterateObjectTypes(inObject,inReader) {
    var output = '';

    if (inObject.getType() == hummus.ePDFObjectIndirectObjectReference) {
      output+= 'Indirect object reference:';
      logToFile(output);
      var objectID = inObject.toPDFIndirectObjectReference().getObjectID();
      if (!mIteratedObjectIDs.hasOwnProperty(objectID)) {
        mIteratedObjectIDs[objectID] = true;
        iterateObjectTypes(inReader.parseNewObject(objectID),inReader);
      }
      for (var i=0;i<mTabLevel;++i) {
        output+=' ';
      }
      output+='was parsed already';
      logToFile(output);
    } else if (inObject.getType() == hummus.ePDFObjectArray) {
      output+= hummus.getTypeLabel(inObject.getType());
      logToFile(output);
      ++mTabLevel;
      inObject.toPDFArray().toJSArray().forEach(function(element, index, array){iterateObjectTypes(element,inReader);});
      --mTabLevel;
    } else if (inObject.getType() == hummus.ePDFObjectDictionary) {
      output+= hummus.getTypeLabel(inObject.getType());
      logToFile(output);
      ++mTabLevel;
      var aDictionary = inObject.toPDFDictionary().toJSObject();

      Object.getOwnPropertyNames(aDictionary).forEach(function(element,index,array)
        {
          logToFile(element);
          iterateObjectTypes(aDictionary[element],inReader);
        });
      --mTabLevel;
    } else if (inObject.getType() == hummus.ePDFObjectStream) {
      output+= 'Stream . iterating stream dictionary:';
      logToFile(output);
      
      parseStream(inObject.toPDFStream(), inReader);
      iterateObjectTypes(inObject.toPDFStream().getDictionary(),inReader);
    } else {
      output+= hummus.getTypeLabel(inObject.getType());
      logToFile(output);
    }
  }


  var pdfReader = hummus.createReader(inputPDF);
  // assert.equal(pdfReader.getPDFLevel(), 1.3, 'getPDFLevel');
  // assert.equal(pdfReader.getPagesCount(), 2, 'getPagesCount');
  var catalog = pdfReader.queryDictionaryObject(pdfReader.getTrailer(),'Root');
  iterateObjectTypes(catalog,pdfReader);
  fs.closeSync(outputFile);
}

function parseStream(pdfStreamInput, pdfReader) {
  var readStream = pdfReader.startReadingFromStream(pdfStreamInput);
  var dict = pdfStreamInput.getDictionary().toJSObject();
  var length = dict.length && dict.length.value || 10000;
  var filter = dict.Filter && dict.Filter.value;

  console.log(JSON.stringify(dict, null, 4));

  var readData = readStream.read(length);
  // console.log('readData', readData);
  
  // while(readStream.notEnded()){
  //   var readData = readStream.read(10000);
  //   console.log('readData', readData);
  // }
}

parse(path.resolve(__dirname, '../output/test1_content.pdf'));