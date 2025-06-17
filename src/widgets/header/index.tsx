import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

const Header = (): React.ReactElement => {
  const location = useLocation();
  const isOrderPage = !location.pathname.match(/^\/order\/\d+$/);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header container">
        <Link to="/">
        <img className="logo" src="img/logo.svg" alt="" />
        </Link>
        <button className="btn-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <img src="img/menu.svg" alt="" />
        </button>
        <Link to="/">
          <img className="logo-in-med" src="img/logo-in-footer.svg" alt="" />
        </Link>
        {isOrderPage && (
          <>
            <Link to="/" className="header-a btn-home">
              Home
            </Link>
            <Link to="/all-restorans" className="header-a btn-all-restaurants">
              All restaurants
            </Link>
            <Link to="/order/1" className="header-a btn-shop">
              <img className="shop" src="img/shop.svg" alt="" />
            </Link>
          </>
        )}
      </header>
      {menuOpen && (
        <div className="dropdown-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-restorans">All restaurants</Link></li>
            <li><Link to="/order/1">Shop</Link></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
