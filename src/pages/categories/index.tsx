import React from 'react';
import { Helmet } from 'react-helmet';
import Footer from '../../widgets/Footer';
import Header from '../../widgets/header';
import CategSection from './section';
import './style.css';

const CategPage = (): React.ReactElement => {
  return (
    <>
      <Helmet>
        <title>Categories - MealDrop</title>
        <meta name="description" content="Explore food categories: Pizza, Burgers, Sushi, Asian, Snacks, Desserts and more on MealDrop" />
      </Helmet>
      <Header />
      <main>
        <div className="top-banner">
          <h2 className="top-banner-title">Categories</h2>
        </div>
        <div className="main-title">What's on the menu?</div>
        <div className="main-discovery">
          Whatever you're craving - we'll deliver it to your door. Feel like having pizza, sushi or
          your favourite dish from Tatooine? Explore your possibilities below.{' '}
        </div>
        <CategSection />
        <Footer />
      </main>
    </>
  );
};

export default CategPage;
