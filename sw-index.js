importScripts('./ngsw-worker.js');
// importScripts('./sw-custom.js');

(function () {
  'use strict';

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    console.log('event', event);
    if (event.action === 'see-more')
      self.clients.openWindow('https://demonishche.github.io/pinger-frontend/' + event.notification.data.url);
  });
}());
