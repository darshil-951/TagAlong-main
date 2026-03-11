const tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

async function testOCR() {
  try {
    // create a dummy image buffer (or read an existing one)
    console.log("Creating dummy image...");
    // let's read the package.json as a buffer just to see if it throws the same error
    const buffer = fs.readFileSync('package.json');
    console.log("Running OCR...");
    const result = await tesseract.recognize(buffer, 'eng');
    console.log("Success:", result.data.text);
  } catch (err) {
    console.error("Error expected:", err);
  }
}

testOCR();
