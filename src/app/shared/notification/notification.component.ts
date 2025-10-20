import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/appnotification.interface';
import { NotificationService } from 'src/app/services';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    standalone: true
})
   export class NotificationComponent implements OnInit, OnDestroy {
    private notificationService = inject(NotificationService);


    notification: AppNotification;
    showNotification: boolean;

     private notificationSubscription: Subscription;

     clear() {
       this.showNotification = false;
     }


     ngOnInit() {
         this.notificationSubscription =
          this
            .notificationService
            .notification$
            .subscribe( data => {
              this.notification = data;
              this.showNotification = true;
            }
         );
     }

     ngOnDestroy() {
       if (this.notificationSubscription) {
         this.notificationSubscription.unsubscribe();
       }
     }
   }