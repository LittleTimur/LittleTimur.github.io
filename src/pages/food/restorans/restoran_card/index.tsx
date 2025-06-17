import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

interface Props {
    img: string;
    title: string;
    review_text: string;
    food: string;
  }

const RestoranCard: React.FC<Props> = ({ img, title, review_text, food }): React.ReactElement => {
  return (<>
    <div className="restoran-card">
        <div>
          <img className="restoran_img" src={img} alt="" />
        </div>
        <div className="restoran-card-content">
          <Link to={`/categories/${food.toLowerCase()}/${title.toLowerCase()}`} className="restoran-card-title">
          {title}
          </Link>
          <div className="restoran-card-review">
            <img className="star" src="img/star.svg" alt="" />{' '}
            <h4 className="review-text">{review_text}</h4>
          </div>
          <h6 className="restoran-card-description">Nicest place for burgers</h6>
          <div className="restoran-card-category">
            <Link to="/categories" className="btn-category">
            Comfort food
            </Link>
          </div>
        </div>
      </div>
      </>
  );
};

export default RestoranCard;