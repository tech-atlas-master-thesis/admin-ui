import { Pipe, PipeTransform } from '@angular/core';
import { StateDto } from '@api/models/pipeline/state-dto';

@Pipe({
  name: 'stateIcon',
})
export class StateIconPipe implements PipeTransform {
  transform(state: StateDto): string {
    switch (state) {
      case StateDto.OPEN:
        return 'pi-circle';
      case StateDto.FINISHED:
        return 'pi-check-circle';
      case StateDto.RUNNING:
        return 'pi-spin pi-spinner';
      case StateDto.ERROR:
        return 'pi-exclamation-triangle';
    }
  }
}
