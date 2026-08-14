import { NewScheduleForm } from '../+new-schedule/new-schedule.interface';

export interface ScheduleForm extends NewScheduleForm {
  id: string;
  edit: boolean;
}
