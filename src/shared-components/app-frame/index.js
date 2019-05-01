import React from 'react';
import { ToastContainer } from 'react-toastify';

import Navbar from '../navbar';
import Footer from '../footer';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

export default ({ children }) => (
  <div className="appFrame">
    <Navbar />
    <ToastContainer autoClose={5000} />
    <div className="bodyPage">
      {children}
    </div>
    <Footer />
  </div>
);
