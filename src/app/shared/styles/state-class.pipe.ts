import { Pipe, PipeTransform } from '@angular/core';
import { StatusDto } from '../../api/models/status-dto';

@Pipe({
  name: 'stateClass',
})
export class StateClassPipe implements PipeTransform {
  transform(state: StatusDto, baseClass: string): string {
    switch (state) {
      case StatusDto.OPEN:
        return baseClass + '--open';
      case StatusDto.FINISHED:
        return baseClass + '--finished';
      case StatusDto.RUNNING:
        return baseClass + '--running';
      case StatusDto.ERROR:
        return baseClass + '--error';
    }
  }
}
