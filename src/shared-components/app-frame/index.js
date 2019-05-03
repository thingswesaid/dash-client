import React from 'react';
import { Adopt } from 'react-adopt';
import { ToastContainer } from 'react-toastify';

import { searchQuery } from '../../operations/queries';
import Navbar from '../navbar';
import Footer from '../footer';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const mapper = {
  searchQuery,
};

export default ({ children }) => (
  <Adopt mapper={mapper} variables={{ skip: true }}>
    {({
      searchQuery: searchData,
    }) => {
      const { refetch, data: { videos } } = searchData;

      return (
        <div className="appFrame">
          <Navbar videos={videos} fetchVideos={refetch} />
          <ToastContainer autoClose={5000} />
          <div className="bodyPage">
            {children}
          </div>
          <Footer />
        </div>
      );
    }}
  </Adopt>
);
