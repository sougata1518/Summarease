import React from 'react';
import Navbar from './Navbar';
import Content from './Content';
import { useAccessCard } from '../Globalvariable/Accessprovider';
import Notification from '../Globalvariable/Notification';

const Home = () => {
  const { notification, setNotification } = useAccessCard();
  return (
    <div className="flex flex-col min-h-screen">
       {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Navbar />
      {/* <main className="flex-1 bg-gray-100 p-6"> */}
        <Content />
      {/* </main> */}
    </div>
  );
};

export default Home;
