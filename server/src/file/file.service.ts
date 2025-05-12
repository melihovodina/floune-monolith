import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image'
}

@Injectable()
export class FileService {
  async createFile(type: FileType, file) {
    try {
      const filePath = path.resolve(process.cwd(), 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      let fileName: string;

      if (type === FileType.IMAGE) {
        fileName = uuid.v4() + '.webp';

        await sharp(file.buffer)
          .webp({ quality: 50 })
          .toFile(path.resolve(filePath, fileName));
      } else {
        const fileExtension = file.originalname.split('.').pop();
        fileName = uuid.v4() + '.' + fileExtension;

        fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      }

      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(filePath: string) {
    try {
      const fullPath = path.resolve(process.cwd(), 'static', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}