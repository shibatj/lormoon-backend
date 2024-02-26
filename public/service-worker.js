self.addEventListener('push', function(event) {
  var data = event.data.json();

  // แสดง notification
  const promiseChain = self.registration.showNotification(data.title, {
    body: data.message,
    icon: 'icon.png',
    tag: 'notification-tag',
    data: data.data
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
  var data = event.notification.data;

  event.notification.close(); // ปิด notification

 // ตรวจสอบว่าเบราว์เซอร์มีหน้าต่างไหนเปิดอยู่หรือไม่
 event.waitUntil(
  clients.matchAll({
    type: "window"
  })
  .then(function(clientList) {
    if (clients.openWindow && data && data.url) {
      return clients.openWindow(data.url);
    }
  })
);
});

