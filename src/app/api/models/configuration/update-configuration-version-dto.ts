import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';

export interface UpdateConfigurationVersionDto {
  name?: string;
  description?: string;
  state: ConfigurationStateDto;
  configuration: object;
}
