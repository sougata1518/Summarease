import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';

const Home = () => {
  return (
    <div className='app-container'>
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <div className="content-wrapper">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Home;
