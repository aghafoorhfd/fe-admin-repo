import React from 'react';
import {
  Card, Row, Col, Image
} from 'antd';
import { useSelector } from 'react-redux';
import RegisterForm from '../../components/RegisterForm';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

function RegisterOne(props) {
  const theme = useSelector((state) => state.theme.currentTheme);
  return (
    <div className="h-100" style={backgroundStyle} data-i="register-container">
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col lg={7} md={20} sm={20} xs={20}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <Image
                    width={170}
                    preview={false}
                    src={`/img/${theme === 'light' ? 'pmo-logo.png' : 'pmo-logo.png'}`} />
                  <p className="text-muted">Create a new account:</p>
                </div>
                <Row justify="center">
                  <Col lg={20} md={20} sm={24} xs={24}>
                    <RegisterForm {...props} />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default RegisterOne;
