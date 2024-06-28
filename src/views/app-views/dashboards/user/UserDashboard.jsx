import React, { useEffect, useState } from 'react';
import {
  Button, Divider, Spin
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { PlusOutlined } from '@ant-design/icons';
import { noop } from 'lodash';
import {
  getUsers,
  hideUserMessage,
  toggleForm
} from 'store/slices/userSlice';
import DataTable from 'components/shared-components/DataTable';

import {
  USER_DASHBOARD_ACTIONS
} from 'constants/MiscConstant';
import { Card } from 'components/shared-components/Card';
import {
  getUsersColumns,
  getCurrentUserActions
} from './data-table-config/user-dashboard-columns';

const UserForm = React.lazy(() => import('components/common/user-form-modal'));

const UserDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [sortedInfo, setSortedInfo] = useState({
    order: '',
    columnKey: 'firstName'
  });

  const {
    user: {
      users,
      message,
      showMessage,
      loading,
      filter: { pageNumber, pageSize }
    }
  } = useSelector((state) => ({
    user: state.user
  }));
  const { content = [] } = users;

  const [selectedRecord, setSelectedRecord] = useState();
  const [selectedAction, setSelectedAction] = useState();
  const totalUsers = users?.totalElements;

  const fetchLatestUsers = () => {
    dispatch(
      getUsers({
        pageNumber,
        pageSize
      })
    );
  };

  useEffect(() => {
    const successMessages = [
      t('component.user.dashboard.userAdded.success.message'),
      t('component.user.dashboard.userEdit.success.message')
    ];
    if (showMessage) {
      if (successMessages.includes(message)) {
        fetchLatestUsers();
      }
      dispatch(hideUserMessage());
    }
  }, [showMessage]);

  const showModal = () => {
    dispatch(toggleForm());
  };

  const operations = () => (
    <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>
      {t('component.user.dashboard.addNewUser')}
    </Button>
  );

  const tableLoading = {
    spinning: loading,
    indicator: <Spin />
  };

  const handleChange = (pagination, filters, sorter) => {
    const { current, pageSize: size } = pagination;
    if (pageNumber !== current || pageSize !== size) {
      dispatch(
        getUsers({
          pageNumber: current,
          pageSize: size
        })
      );
    } else {
      setSortedInfo(sorter);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setSelectedAction({ actionType: null, actionHandler: noop });
    dispatch(toggleForm());
  };

  const handleActions = (actionType, record) => {
    switch (actionType) {
      case USER_DASHBOARD_ACTIONS.EDIT_USER:
        handleEdit(record);
        break;
      default:
    }
  };
  useEffect(() => {
    fetchLatestUsers();
  }, []);

  return (
    <>
      <UserForm
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        action={selectedAction}
        setAction={setSelectedAction} />
      <Card
        heading={t('sidenav.dashboard.currentUsers')}
        description={t('component.user.dashboard.widget.description')}
        tagText={`${totalUsers} ${t('component.user.dashboard.label.users')}`}
        actionBtn={operations()}>
        <Divider />
        <DataTable
          loading={tableLoading}
          data={content}
          handleChange={handleChange}
          showPagination
          pageSize={pageSize}
          currentPage={pageNumber}
          totalElements={totalUsers}
          columns={[
            ...getUsersColumns(sortedInfo, handleActions),
            getCurrentUserActions(handleActions)
          ]} />
      </Card>
    </>
  );
};

export default UserDashboard;
