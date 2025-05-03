import multer, { Multer, StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";

const storage: StorageEngine = {
  _handleFile: (_req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) => {
    console.log(file.originalname);
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filename = `${Date.now()}-${file.originalname}`;
    const destination = `${dir}/${filename}`;
    file.stream.pipe(fs.createWriteStream(destination));
    cb(null, {
      destination: destination,
      filename: filename,
      path: destination,
      size: file.size,
    });
  },
  _removeFile: (_req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) => {
    fs.unlink(file.path, cb);
  }
};

const csvFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log("Reading file in middleware", file.originalname);
  if (file == undefined) {
    cb(null, false);
  } else if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadCsvFile: Multer = multer({
  storage: storage,
  fileFilter: csvFilter
});
