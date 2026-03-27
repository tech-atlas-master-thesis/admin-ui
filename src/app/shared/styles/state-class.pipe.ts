import { Pipe, PipeTransform } from '@angular/core';
import { StateDto } from '@api/models/pipeline/state-dto';

@Pipe({
  name: 'stateClass',
})
export class StateClassPipe implements PipeTransform {
  transform(state: StateDto, baseClass: string): string {
    switch (state) {
      case StateDto.OPEN:
        return baseClass + '--open';
      case StateDto.FINISHED:
        return baseClass + '--finished';
      case StateDto.RUNNING:
        return baseClass + '--running';
      case StateDto.ERROR:
        return baseClass + '--error';
    }
  }
}
