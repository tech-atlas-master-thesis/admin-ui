import { DataSetDto } from '@api/models/dataset/data-set-dto';
import { PipelineDto } from '@api/models/pipeline/pipeline-dto';
import { ScheduleDto } from '@api/models/schedule/schedule-dto';

export interface DashboardDto {
  pipelines: DashboardPipelinesDto;
  schedules: DashboardSchedulesDto;
  dataSets: DashboardDataSetsDto;
}

export interface DashboardPipelinesDto {
  open: number;
  running: number;
  finished: number;
  error: number;
  recentErrors: PipelineDto[];
}

export interface DashboardSchedulesDto {
  active: number;
  recentlyExecuted: ScheduleDto[];
}

export interface DashboardDataSetsDto {
  total: number;
  latest?: DataSetDto;
}
