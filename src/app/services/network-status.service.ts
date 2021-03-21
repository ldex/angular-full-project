import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class NetworkStatusService {

    private isOnlineSubject = new BehaviorSubject<boolean>(true);
    isOnline$: Observable<boolean> = this.isOnlineSubject.asObservable();

    constructor() {
        merge<boolean>(
            fromEvent(window, "offline").pipe(mapTo(false)),
            fromEvent(window, "online").pipe(mapTo(true)),
            of(navigator.onLine)
        )
        .subscribe(online => this.isOnlineSubject.next(online));
    }
}
