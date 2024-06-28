import React, { useState, Suspense, useEffect } from 'react';
import {
  Col, Row, Typography, Button
} from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from 'components/shared-components/Loading';
import DataTable from 'components/shared-components/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRolesAndPrivileges } from 'store/slices/plansSlice';
import { getPrivilegeColumns } from './PrivilegesTableConfig';

const AddPrivilegesModal = React.lazy(() => import('./AddNewPrivileges'));

const { Title } = Typography;

const AddPrivilegesScreen = () => {
  const [isPrivilegesModalVisible, setPrivilegesModalVisible] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState({});
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    pmoScreenPrivileges: privilegesData,
    rolePrivilegesLoading: loading
  } = useSelector((state) => ({ ...state.plan }));

  useEffect(() => {
    dispatch(getUserRolesAndPrivileges());
  }, []);

  const handleEditPrivilege = (record) => {
    setSelectedPrivilege(record);
    setPrivilegesModalVisible(true);
  };

  return (
    <>
      <Row justify="space-between" align="middle" className="mb-3">
        <Col>
          <Title className="mb-0" strong level={3}>{t('component.admin.privileges.dashboard.title')}</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setPrivilegesModalVisible(true)}>
            {t('component.admin.privileges.add.privilege.title')}
          </Button>
        </Col>
      </Row>
      <DataTable
        id="id"
        data={privilegesData}
        loading={loading}
        columns={getPrivilegeColumns(handleEditPrivilege)} />
      {
          isPrivilegesModalVisible && (
            <Suspense fallback={<Loading cover="content" />}>
              <AddPrivilegesModal
                setSelectedPrivilege={setSelectedPrivilege}
                selectedRecord={selectedPrivilege}
                setPrivilegesModalVisible={setPrivilegesModalVisible}
                isOpen={isPrivilegesModalVisible} />
            </Suspense>
          )
        }
    </>
  );
};

export default AddPrivilegesScreen;
