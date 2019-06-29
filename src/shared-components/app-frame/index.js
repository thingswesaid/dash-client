import React from 'react';
import { ToastContainer, toast as notification } from 'react-toastify';

import Navbar from '../navbar';
import Footer from '../footer';
import { getUrlParams } from '../../utils';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const { notification: message, notificationType: type } = getUrlParams();
const isRefresh = window.performance.navigation.type !== 0;
if (message && type && !isRefresh) notification[type](message);
else if (message && !isRefresh) notification(message);

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
