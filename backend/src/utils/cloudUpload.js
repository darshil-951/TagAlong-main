/**
 * Converts a file buffer to a base64 data URI string.
 * This stores images directly in MongoDB, removing all external service dependencies.
 * Same approach used by chatController.js for chat images.
 * 
 * @param {Buffer} fileBuffer - The image buffer from multer memory storage
 * @param {String} mimetype - The MIME type of the file (e.g., 'image/jpeg')
 * @returns {String} - A data URI string (e.g., 'data:image/jpeg;base64,...')
 */
const bufferToDataUri = (fileBuffer, mimetype = 'image/jpeg') => {
  const base64 = fileBuffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

module.exports = { bufferToDataUri };
