import React from 'react';
import Footer_Block from './block';
import { useLocation } from 'react-router-dom';
import './style.css';


const Footer = (): React.ReactElement => {
  const location = useLocation();
  const isCategoriesPage = location.pathname === '/categories';
  const isRestoranPage = location.pathname === '/categories/:category/:restoran' || location.pathname === '/restorans/:restoran';
  const ft_class = isRestoranPage ? 'footer-mr-ziro' : 'footer';

  return (
    <>
      <div className={ft_class}>
        {isCategoriesPage ? (
          <img className="logo-in-footer" src="img/logo-in-footer-green.svg" alt="" />
        ) : (
          <img className="logo-in-footer" src="img/logo-in-footer.svg" alt="" />
        )}
        <Footer_Block
          footer_title="discover-us"
          title="Discover us"
          link1="/"
          link_title1="Home"
          link2="/categories"
          link_title2="Categories"
          link3="/order/1"
          link_title3="Shop"
        />
        <Footer_Block
          footer_title="social-media"
          title="Our social media"
          link1="https://www.facebook.com"
          link_title1="Facebook"
          link2="https://www.instagram.com"
          link_title2="Instagram"
          link3="https://www.twitter.com"
          link_title3="Twitter"
        />
        <Footer_Block
          footer_title="our-apps"
          title="Contacts"
          link1="tel:+1234567890"
          link_title1="Phone"
          link2="mailto:info@restoran.com"
          link_title2="Mail"
          link3="/"
          link_title3="None"
        />
      </div>
    </>
  );
};

export default Footer;
