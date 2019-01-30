importScripts('./ngsw-worker.js');
// importScripts('./sw-custom.js');

(function () {
  'use strict';

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    console.log('event', event);
    if (event.action === 'see-more')
      self.clients.openWindow('http://localhost:8001' + event.notification.data.url);
  });
}());
