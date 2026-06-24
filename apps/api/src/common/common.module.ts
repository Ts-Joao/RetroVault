import { Module } from "@nestjs/common";
import { SlugServiceProtocol } from "./utils/slug/slug.service";
import { SlugifyService } from "./utils/slug/slugify.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    AuthModule
  ],
  providers: [
    {
      provide: SlugServiceProtocol,
      useClass: SlugifyService
    }
  ],
  exports: [
    SlugServiceProtocol,
    AuthModule
  ],
})
export class CommonModule {}