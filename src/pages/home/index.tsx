import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../widgets/header';
import Banner from './banner';
import Carusel_Pick from './carusel/pick';
import Carusel_Arrivals from './carusel/arrivals';
import Carusel_Categories from './carusel/categories';
import Footer from '../../widgets/Footer';
import { Link } from 'react-router-dom';
import './style.css';

const HomePage = (): React.ReactElement => {
  return (
    <>
      <Helmet>
        <title>MealDrop - Find Your Next Meal</title>
        <meta name="description" content="Discover the best restaurants and order delicious food online with MealDrop" />
      </Helmet>
      <Header />
      <main>
        <div className="hungry">
          <h2 className="hungry-title">
            <b className="hungry-b">Hungry?</b> Find your next meal
          </h2>
          <Link to='/all-restorans' className='hungry-button'>See all restaurants</Link>
          <img className="Ladies" src="img/Ladies.svg" alt="" />
        </div>
        <Carusel_Pick />
        <Banner />
        <Carusel_Arrivals />
        <Carusel_Categories />
        <Footer />
      </main>
    </>
  );
};

export default HomePage;
