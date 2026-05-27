import { DatabaseService } from 'src/database/database.service';
import { SlugServiceProtocol } from './slug.service';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugifyService implements SlugServiceProtocol {
  constructor(private readonly databaseService: DatabaseService) {}

  async generateSlug<M extends keyof DatabaseService>(
    name: string,
    model: M,
  ): Promise<string> {
    const base = slugify(name, { lower: true, strict: true });

    const modelType = this.databaseService[model] as any;

    const existing = await modelType.findUnique({
      where: { slug: base },
      select: { slug: true },
    });

    if (!existing) {
      return base;
    }

    const suffix = Math.random().toString(36).substring(2, 10);
    return `${base}-${suffix}`;
  }

  async adjustSlug<M extends keyof DatabaseService>(
    oldName: string,
    newName: string | undefined,
    slug: string,
    model: M,
  ): Promise<string> {
    if (newName && newName !== oldName) {
      return this.generateSlug(newName, model);
    }

    return slug;
  }
}
