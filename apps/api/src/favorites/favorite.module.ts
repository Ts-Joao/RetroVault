import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ DatabaseModule ],
  controllers: [ FavoriteController ],
  providers: [ FavoriteService ],
  exports: [ FavoriteService ],
})
export class FavoritesModule {}