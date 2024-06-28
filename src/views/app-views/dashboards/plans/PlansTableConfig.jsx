import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import {
  EditOutlined
} from '@ant-design/icons';
import {
  PLAN_ACTIONS
} from 'constants/MiscConstant';

export const getColumns = (handleAction) => {
  const { t } = useTranslation();
  const menuItems = [

    {
      key: PLAN_ACTIONS.EDIT_PLAN,
      label: t('component.admin.plans.dashboard.table.action.editPlan')
    },
    {
      key: PLAN_ACTIONS.DELETE_PLAN,
      label: t('component.admin.plans.dashboard.table.action.deletePlan')
    },
    {
      key: PLAN_ACTIONS.ADD_EDIT_SCREEN_PRIVILEGES,
      label: t('component.admin.plans.dashboard.table.action.screenPrivileges')
    }
  ];
  return (
    [
      {
        key: 'name',
        dataIndex: 'name',
        title: t('component.admin.plans.dashboard.table.column.planName'),
        width: 200
      },
      {
        key: 'maxLicenses',
        dataIndex: 'maxLicenses',
        title: t('component.admin.plans.dashboard.table.column.maxLicenses'),
        width: 200
      },
      {
        key: 'currency',
        dataIndex: 'currency',
        title: t('component.admin.plans.dashboard.table.column.currency'),
        width: 200
      },
      {
        key: 'basePrice',
        dataIndex: 'basePrice',
        title: t('component.admin.plans.dashboard.table.column.basePrice'),
        width: 200,
        render: (data) => `$${data}`
      },
      {
        align: 'center',
        title: t('component.table.column.actions'),
        width: 120,
        fixed: 'right',
        render: (_, record) => (

          <EllipsisDropdown
            icon={<EditOutlined />}
            menu={(
              <Menu
                onClick={({ key }) => {
                  handleAction(key, record);
                }}
                items={menuItems} />
)} />

        )
      }
    ]
  );
};
