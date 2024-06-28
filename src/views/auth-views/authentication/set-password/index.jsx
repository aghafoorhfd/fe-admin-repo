import {
  Card, Col, notification, Row, Image
} from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserService from 'services/UserService';
import { AUTH_PREFIX_PATH } from 'configs/AppConfig';
import IntlMessage from 'components/util-components/IntlMessage';
import { TOKEN_EXPIRE_ERROR_CODE } from 'constants/MiscConstant';
import SetPasswordForm from '../../components/SetPasswordForm';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};
export default function SetPassword({ newUser }) {
  const { t } = useTranslation();

  const [userId, setUserId] = useState(null);
  const { tenantId, token } = useParams();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    let verifyToken = true;
    if (token && tenantId) {
      const verifySetPasswordToken = async (authToken) => {
        try {
          const { data } = await UserService.verifySetPasswordToken(authToken);
          if (verifyToken) {
            setUserId(data?.iamId ? data?.iamId : data?.userId);
          }
        } catch (err) {
          const { code } = err;
          let { message } = err;
          const isTokenExpired = TOKEN_EXPIRE_ERROR_CODE.includes(code);
          if (newUser) {
            navigate(`${AUTH_PREFIX_PATH}/register`);
            if (isTokenExpired) message = t('component.auth.setPassword.expired.error');
          } else {
            navigate(`${AUTH_PREFIX_PATH}/forgot-password`);
            if (isTokenExpired) message = t('component.auth.resetPassword.expired.error');
          }
          notification.error({ message });
        }
      };
      verifySetPasswordToken(token);
    }
    return () => {
      verifyToken = false;
    };
  }, [token]);
  return (
    userId && (
      <div className="h-100" style={backgroundStyle}>
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
                    <div className="text-muted">
                      <IntlMessage id="component.auth.setPassword" />
                    </div>
                  </div>
                  <Row justify="center">
                    <Col lg={20} md={20} sm={24} xs={24}>
                      <SetPasswordForm userId={userId} newUser={newUser} tenantId={tenantId} />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  );
}
