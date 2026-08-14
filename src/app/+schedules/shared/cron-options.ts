import { SelectItem } from 'primeng/api';

export const CronOptions: SelectItem<string>[] = [
  {
    label: 'enum.cron.everyDay',
    value: '0 0 * * *',
  },
  {
    label: 'enum.cron.everyWeek',
    value: '0 0 * * 0',
  },
  {
    label: 'enum.cron.everyMonth',
    value: '0 0 1 * *',
  },
];
