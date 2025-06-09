import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as mm from 'music-metadata'; 

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image'
}

@Injectable()
export class FileService {
  async createFile(type: FileType, file): Promise<{ path: string, duration?: number }> {
    try {
      const filePath = path.resolve(process.cwd(), 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      let fileName: string;
      let duration: number | undefined;

      if (type === FileType.IMAGE) {
        fileName = uuid.v4() + '.webp';
        await sharp(file.buffer)
          .webp({ quality: 50 })
          .toFile(path.resolve(filePath, fileName));
      } else if (type === FileType.AUDIO) {
        fileName = uuid.v4() + '.aac';

        const tempFilePath = path.resolve(filePath, uuid.v4() + path.extname(file.originalname));
        fs.writeFileSync(tempFilePath, file.buffer);

        const metadata = await mm.parseFile(tempFilePath);
        duration = metadata.format.duration ? Math.round(metadata.format.duration) : 0;

        const outputPath = path.resolve(filePath, fileName);
        await this.convertToAac(tempFilePath, outputPath);

        fs.unlinkSync(tempFilePath);
      } else {
        throw new HttpException('Unsupported file type', HttpStatus.BAD_REQUEST);
      }

      return { path: type + '/' + fileName, duration };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async convertToAac(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .audioCodec('aac')
        .audioBitrate(128)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async removeFile(filePath: string) {
    try {
      const fullPath = path.resolve(process.cwd(), 'static', filePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}