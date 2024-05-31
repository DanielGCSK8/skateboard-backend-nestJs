import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaderoModule } from './madero/madero.module';

@Module({
  imports: [MaderoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
