import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateNamePipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new BadRequestException('Name is not valid');
    }
    return value;
  }
}
