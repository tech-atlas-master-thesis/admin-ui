import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { EventTypeDto } from '@api/models/pipeline/event-type-dto';

export interface StepEventDto {
  timestamp: Date;
  message: LocalisedStringDto;
  type: EventTypeDto;
}
