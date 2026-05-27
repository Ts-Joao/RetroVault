import { Module } from "@nestjs/common";
import { SlugServiceProtocol } from "./utils/slug/slug.service";
import { SlugifyService } from "./utils/slug/slugify.service";

@Module({
  providers: [
    {
      provide: SlugServiceProtocol,
      useClass: SlugifyService
    }
  ],
  exports: [SlugServiceProtocol],
})
export class CommonModule {}