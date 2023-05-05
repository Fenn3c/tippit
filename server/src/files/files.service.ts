import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs'
import { v4 } from 'uuid';

const ALLOWED_EXT = ['.jpg', '.png', '.jpeg']

@Injectable()
export class FilesService {
    async createImage(file): Promise<string> {
        try {
            const ext = path.extname(file.originalname)
            if (!ALLOWED_EXT.includes(ext)) throw new BadRequestException('Неподдерживаемый формат файла')
            const fileName = v4() + ext
            const filePath = path.resolve(__dirname, '..', 'static')
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName
        } catch (e) {
            console.error(e)
            throw new InternalServerErrorException('Произошла ошибка при записи файла')
        }
    }
}
