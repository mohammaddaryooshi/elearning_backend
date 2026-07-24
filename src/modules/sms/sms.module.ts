import { Global, Module } from '@nestjs/common';
import { FarazSmsService } from './faraz-sms.service';

@Global()
@Module({
    providers: [FarazSmsService],
    exports: [FarazSmsService],
})
export class SmsModule { }
