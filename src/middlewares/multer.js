const multer = require("multer");

const storage = multer.memoryStorage(); // Store as Buffer [cite: 2025-11-21]
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB Limit
});

module.exports = upload;