const tesseract = require('tesseract.js');
const fs = require('fs');

async function testOCR() {
  try {
    // create a 1x1 jpeg base64
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    const buffer = Buffer.from(base64, 'base64');
    
    console.log("Running OCR on valid image buffer...");
    const result = await tesseract.recognize(buffer, 'eng');
    console.log("Success:", result.data.text);
  } catch (err) {
    console.error("Caught Error:", err);
  }
}

testOCR();
