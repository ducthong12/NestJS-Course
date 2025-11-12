import { Inject, Injectable } from '@nestjs/common';
import { access, readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import type { DbModuleOptions } from './db.module';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions;

  async write(obj: Record<string, any>) {
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf-8',
    });
  }

  async read(): Promise<User[]> {
    const filePath = this.options.path;
    if (fs.existsSync(filePath)) {
      await access(filePath);

      const data = await readFile(filePath, {
        encoding: 'utf-8',
      });

      return JSON.parse(data) as User[];
    }
    return [];
  }
}
