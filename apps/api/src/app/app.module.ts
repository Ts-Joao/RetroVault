import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
