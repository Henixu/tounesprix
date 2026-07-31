const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const allowedExtensions = /jpeg|jpg|png|webp|gif/;

function imageFileFilter(req, file, cb) {
  const isValidExt = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedExtensions.test(file.mimetype);

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }

  cb(new Error("Seuls les fichiers image (jpg, png, webp, gif) sont acceptes"));
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
