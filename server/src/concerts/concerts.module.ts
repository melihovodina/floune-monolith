import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Concert, ConcertSchema } from './entities/concert.entity';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    FileModule,
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService]
})
export class ConcertsModule {}