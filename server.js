var webPush = require('web-push');

var pushSubscription = {
    endpoint : 'https://fcm.googleapis.com/fcm/send/c89GXjRBk8s:APA91bEdwu9lFUPWpU0_29ZjAPZKEczN020nH4iF-LCPP8SRnx9hF9dN9rS0Q9N7YMzShk2LVncaONt7rQe69bfLWS_BXVKm7FBdWmAE9skzIszMs-lzml14dvKskO1DMWoI-7YoRRz7',
     keys :{ 
         "p256dh":"BF2LCwK1xfHgi2-dMjpC6IGCNsGmzAHfbI_EjvNX9riAWVIfxxJEpIuEIFovq4_DWOjAOlLcW3yaqcm0lidvSwM=",
         "auth":"gLMuK7TmYM03Qneh_COrhQ=="
     }
}

var payload = 'Here is a payload!';

var options = {
  TTL: 60,
  vapidDetails: {
    subject: 'mailto: crong@codesquad.kr',
    publicKey: "BEZMmtd6T_CIxUQqUGW9zOGPb2uLYE2QPAB8qtdpHWipv4HaB0hEp0ydOyGDlT6m3AGlQgTTuXNI_8Z8GiPUv3Y",
    privateKey:  "xALZQYqZeGyrAf_I8ZQBTcXZ6kZAWWWU5ApXnDN8390"
  }
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);