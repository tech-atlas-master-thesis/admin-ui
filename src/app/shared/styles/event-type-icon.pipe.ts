import { Pipe, PipeTransform } from '@angular/core';
import { EventTypeDto } from '@api/models/pipeline/event-type-dto';

@Pipe({
  name: 'eventTypeIcon',
})
export class EventTypeIconPipe implements PipeTransform {
  transform(state: EventTypeDto): string {
    switch (state) {
      case EventTypeDto.DEBUG:
        return 'pi-wrench';
      case EventTypeDto.INFO:
        return 'pi-info-circle';
      case EventTypeDto.WARNING:
        return 'pi-exclamation-triangle';
      case EventTypeDto.ERROR:
        return 'pi-times-circle';
      case EventTypeDto.RESULT:
        return 'pi-database';
    }
  }
}
