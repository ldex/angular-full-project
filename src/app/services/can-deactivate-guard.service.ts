import { Injectable }    from '@angular/core';

import { Observable }    from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class CanDeactivateGuardService  {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}