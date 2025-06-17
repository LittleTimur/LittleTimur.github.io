import React from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import HomePage from './pages/home';
import CategPage from './pages/categories';
import Food from './pages/food';
import RestoranPage from './pages/restoran';
import Order1 from './pages/form/order_1';
import Order2 from './pages/form/order_2';
import Order3 from './pages/form/order_3';
import AllRestoransPage from './pages/allrestorans';

import { Provider } from 'react-redux'
import store from './data/store'

const OrderWrapper = () => {
  const { id } = useParams();
  if(id === '1')
    return <Order1 />;
  else if(id === '2')
    return <Order2 />;
  else if(id === '3')
    return <Order3/>;
};

const Navi = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategPage />} />
        <Route path="/categories/:category" element={<Food />} />
        <Route path="/categories/:category/:restoran" element={<RestoranPage />} />
        <Route path="/restorans/:restoran" element={<RestoranPage />} />
        <Route path="/all-restorans" element={<AllRestoransPage />} />
        <Route path="/order/:id" element={<OrderWrapper />} />
      </Routes>
    </Router>
    </Provider>
  );
};

export default Navi;
