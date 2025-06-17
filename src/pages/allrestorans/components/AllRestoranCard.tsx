import React from 'react';
import { Link } from 'react-router-dom';
import './allrestoran_card.css';

interface Props {
    img: string;
    title: string;
    review_text: string;
    isReversed?: boolean;
}

const AllRestoranCard: React.FC<Props> = ({ img, title, review_text, isReversed }): React.ReactElement => {
  return (<>
    <div className={`all-restoran-card ${isReversed ? 'all-restoran-card--reversed' : ''}`}>
        {isReversed ? (
            <div className="all-restoran-card-content">
                <Link to={`/restorans/${title.toLowerCase()}`} className="all-restoran-card-title">
                {title}
                </Link>
                <div className="all-restoran-card-review">
                    <img className="star" src="img/star.svg" alt="" />{' '}
                    <h4 className="review-text">{review_text}</h4>
                </div>
                <h6 className="all-restoran-card-description">Nicest place for burgers</h6>
                <div className="all-restoran-card-category">
                    <Link to="/categories" className="btn-category">
                    Comfort food
                    </Link>
                </div>
            </div>
        ) : (
            <div>
                <img className="all-restoran_img" src={img} alt="" />
            </div>
        )}

        {isReversed ? (
            <div>
                <img className="all-restoran_img" src={img} alt="" />
            </div>
        ) : (
            <div className="all-restoran-card-content">
                <Link to={`/restorans/${title.toLowerCase()}`} className="all-restoran-card-title">
                {title}
                </Link>
                <div className="all-restoran-card-review">
                    <img className="star" src="img/star.svg" alt="" />{' '}
                    <h4 className="review-text">{review_text}</h4>
                </div>
                <h6 className="all-restoran-card-description">Nicest place for burgers</h6>
                <div className="all-restoran-card-category">
                    <Link to="/categories" className="btn-category">
                    Comfort food
                    </Link>
                </div>
            </div>
        )}
      </div>
      </>
  );
};

export default AllRestoranCard; 