import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  img: string;
  title: string;
  review_text: string;
}

const Card: React.FC<Props> = ({ img, title, review_text }): React.ReactElement => {
  return (
    <>
      <div className="pick-card">
        <div>
          <img className="pick_img" src={img} alt="" />
        </div>
        <div className="pick-card-content">
          <Link to={`/restorans/${title.toLowerCase()}`} className="pick-card-title">
            {title}
          </Link>
          <div className="pick-card-review">
            <img className="star" src="img/star.svg" alt="" />{' '}
            <h4 className="review-text">{review_text}</h4>
          </div>
          <h6 className="pick-card-description">Nicest place for burgers</h6>
          <div className="pick-card-category">
            <Link to='/' className="btn-category">
              Comfort food
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
