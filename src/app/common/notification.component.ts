import { Component, OnInit, OnDestroy, ErrorHandler, ChangeDetectorRef } from '@angular/core';
import { AppNotification } from '../appnotification.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component( {
    selector: 'app-notification',
    templateUrl: './notification.component.html'
   } )
   export class NotificationComponent implements OnInit, OnDestroy {
   
    notification: AppNotification;
    showNotification: boolean;

     private notificationSubscription: Subscription;

     clear() {
       this.showNotification = false;
     }
   
     constructor(
      private notificationService: NotificationService,
     ) {
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