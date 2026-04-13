import { Router } from "express";
import multer from "multer";
import path from "path";

const uploadRouter = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

uploadRouter.post("/logo", upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  return res.status(200).json({
    file: {
      url: fileUrl,
      name: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    },
  });
});

export default uploadRouter;