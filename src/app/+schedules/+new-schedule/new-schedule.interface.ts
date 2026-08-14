import { NewPipelineForm } from '../../+pipelines/+new-pipeline/new-pipeline.interface';

export interface NewScheduleForm extends NewPipelineForm {
  cron: string;
  active: boolean;
}
