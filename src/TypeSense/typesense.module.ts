import { Module, forwardRef } from '@nestjs/common';
import { TypeSenseService } from './typesense.service';
import { RoomModule } from 'src/Modules/Room/room.module';

@Module({
  imports: [forwardRef(() => RoomModule)],
  providers: [TypeSenseService],
  exports: [TypeSenseService],
})
export class TypeSenseModule {}
