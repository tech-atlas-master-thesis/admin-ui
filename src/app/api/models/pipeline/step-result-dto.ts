export enum StepResultType {
  STRING = 'STRING',
  JSON = 'JSON',
  CSV = 'CSV',
}

export interface StepResultDto {
  type: StepResultType;
  preview: boolean;
  data: string;
}
