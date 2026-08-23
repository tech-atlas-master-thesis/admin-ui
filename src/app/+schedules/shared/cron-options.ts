import { SelectItem } from 'primeng/api';

export const CronOptions: SelectItem<string>[] = [
  {
    label: 'enum.cron.everyDay0000',
    value: '0 0 * * *',
  },
  {
    label: 'enum.cron.everyDay0100',
    value: '0 1 * * *',
  },
  {
    label: 'enum.cron.everyWeekSun0000',
    value: '0 0 * * 0',
  },
  {
    label: 'enum.cron.everyWeekSun0100',
    value: '0 1 * * 0',
  },
  {
    label: 'enum.cron.everyMonth01',
    value: '0 0 1 * *',
  },
];
