import { Injectable } from '@angular/core';

import {firebase} from '@firebase/app';
import '@firebase/messaging';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
token: string;
  constructor() { }

  init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.serviceWorker.ready.then((registration) => {
            // Don't crash an error if messaging not supported
            if (!firebase.messaging.isSupported()) {
                   resolve();
                   return;
            }
            const messaging = firebase.messaging();

            // Register the Service Worker
            messaging.useServiceWorker(registration);

            // Initialize your VAPI key
            messaging.usePublicVapidKey(
              environment.firebase.vapidKey
            );

            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                console.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });

            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }
  requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        if (!Notification) {
            resolve();
            return;
        }
        if (!firebase.messaging.isSupported()) {
            resolve();
            return;
        }
        try {
            const messaging = firebase.messaging();
            Notification.requestPermission(status => {
                console.log(status);
             });
            this.token = await messaging.getToken();
            console.log('User notifications token:', this.token);

        } catch (err) {
            // No notifications granted
        }
        resolve();
    });
}
getCurrentToken() {
    return this.token ? this.token : '';
}
}
