import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from '../../shared/services/email.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
