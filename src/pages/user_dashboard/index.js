import React, { useEffect, useState} from 'react';
import axios from 'axios';

import StateMain from 'src/views/user_charger/state_main'

import { ProjectAppProvider } from 'src/views/user_charger/state_context'
import authConfig from 'src/configs/auth';

const getAccountID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const ProjectPage = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Request notification permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
  
          // Register service worker
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              // Subscribe to push notifications
              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BFrovD1VRuYsvonwdMbKPSEPME1fKX6B3VSk1Ys6j1Eg6clQb7n91hNp4PZwBeMf_ch3aFOsJerPppt2v133zik')
              });
            })
            .then(subscription => {
              console.log('User is subscribed:', subscription);
        
              // Prepare the subscription object and AccountID for the server
              const AccountID = getAccountID();
              const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
  
              const subscriptionData = {
                token,
                subscription,
                AccountID
              };
        
              // Send the subscription object and AccountID to your server
              axios.post('/api/save-subscription', subscriptionData)
                .then(response => {
                  console.log('Subscription saved on server:', response.data);
                })
                .catch(error => {
                  console.error('Error sending subscription to server:', error);
                });
            })
            .catch(error => {
              console.error('Service Worker Error', error);
            });
        } else {
          console.warn('Notification permission was not granted.');
        }
      });
    } else {
      console.warn('Push messaging is not supported');
    }
  
    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);

      const base64 = (base64String + padding)

        .replace(/\-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);

      return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
    }
  }, []);
  

  return (
    <ProjectAppProvider>
      <StateMain  />
  </ProjectAppProvider>    
  );
};

export default ProjectPage;
