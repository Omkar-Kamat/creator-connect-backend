import multer from "multer";

export class MulterMiddleware {

  constructor() {
    this.storage = multer.memoryStorage();

    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 100 * 1024 * 1024
      }
    });
  }

  single(fieldName) {
    return this.upload.single(fieldName);
  }

  array(fieldName, maxCount) {
    return this.upload.array(fieldName, maxCount);
  }

  fields(fieldConfigs) {
    return this.upload.fields(fieldConfigs);
  }

}

export const multerMiddleware = new MulterMiddleware();