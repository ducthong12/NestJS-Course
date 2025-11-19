import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Email is not required');
    }

    // Sử dụng hàm isEmail của class-validator để check thủ công
    if (!isEmail(value)) {
      throw new BadRequestException('Email is not valid');
    }

    return value;
  }
}
