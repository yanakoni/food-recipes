import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { MAX_PREVIEW_CARD_TEXT_LENGTH } from '../../../utils/constants';
import { shorten } from '../../../utils/shortenText';
import { Meal } from '../../../types/meal';
import './MealCard.scss';

const MealCard = ({ meal }: MealCardProps) => {
  const { name, categoryName, mealThumb, instructions, areaName } = meal;

  return (
    <Card className="meal-card mb-5">
      <CardHeader>
        <h5>{name}</h5>
      </CardHeader>
      <CardBody>
        <Row className="mb-2">
          <img src={mealThumb} alt={name} />
        </Row>
        <Row>
          <Col>
            <h6>Category: {categoryName}</h6>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h6>Origin: {areaName}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{shorten(instructions, MAX_PREVIEW_CARD_TEXT_LENGTH)}</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

type MealCardProps = {
  meal: Meal;
};

export { MealCard };
