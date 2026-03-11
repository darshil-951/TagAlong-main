require('dotenv').config();
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '695750f03f8d2bc08ad5aeca' }, process.env.JWT_SECRET || 'fallback');

const formData = new FormData();
const fs = require('fs');
formData.append('image', new Blob([fs.readFileSync('package.json')]), 'package.json');
fetch('http://localhost:5000/api/chat/upload-image', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
}).then(r => r.json()).then(console.log).catch(console.error);
