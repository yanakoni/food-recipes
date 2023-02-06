import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Pages } from '../../enums/pages.enum';
import { ReactComponent as NotFoundImg } from './not-found.svg';
import { DeviceType, useDeviceType } from '../../utils/useDeviceType';
import { getButtonSizeClass } from '../../utils/getButtonSizeClass';

const IMG_WIDTH_SM = 150;
const IMG_WIDTH_MD = 200;
const IMG_WIDTH_LG = 250;

const getImgWidth = (deviceType: DeviceType): number => {
  switch (deviceType) {
    case 'mobile':
      return IMG_WIDTH_SM;
    case 'tablet':
      return IMG_WIDTH_MD;
    default:
      return IMG_WIDTH_LG;
  }
};

const NotFound = () => {
  const deviceType = useDeviceType();

  return (
    <Row className="not-found-page h-100 align-items-center justify-content-center align-self-center">
      <Col md={4} className="d-flex flex-column align-items-center gap-5">
        <div className="text-center">
          <h1 className="mb-3 text-secondary">Not Found</h1>
        </div>
        <NotFoundImg width={getImgWidth(deviceType)} height="auto" title="" />
        <Button tag={Link} to={Pages.MAIN} color="secondary" className={getButtonSizeClass(deviceType)}>
          Back to the Main page
        </Button>
      </Col>
    </Row>
  );
};

export { NotFound };
