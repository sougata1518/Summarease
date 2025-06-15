import React from 'react';
import Navbar from './Navbar';
import Content from './Content';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* <main className="flex-1 bg-gray-100 p-6"> */}
        <Content />
      {/* </main> */}
    </div>
  );
};

export default Home;
