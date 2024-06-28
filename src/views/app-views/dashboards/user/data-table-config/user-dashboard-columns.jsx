import {
  Menu
} from 'antd';
import {
  EditOutlined
} from '@ant-design/icons';
import { noop } from 'lodash';
import IntlMessage from 'components/util-components/IntlMessage';
import {
  USER_DASHBOARD_ACTIONS
} from 'constants/MiscConstant';
import { antdTableSorter, phoneFormat } from 'utils/utils';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { ROLES } from 'constants/RolesConstant';

export const getUsersColumns = (sortedInfo = { columnKey: '', order: '' }) => [
  {
    title: <IntlMessage id="component.table.column.name" />,
    dataIndex: 'firstName',
    key: 'firstName',
    render: (_, record) => {
      const fName = record.firstName || '';
      const lName = record.lastName || '';
      return (
        <span>
          {(fName ? (`${fName} `) : '') + lName}
          <br />
          <small>{record?.email}</small>
        </span>
      );
    },
    sorter: (a, b) => antdTableSorter(a, b, 'firstName'),
    sortOrder: sortedInfo.columnKey === 'firstName' && sortedInfo.order,
    ellipsis: true
  },
  {
    title: <IntlMessage id="component.table.column.accessType" />,
    dataIndex: 'accessTypeName',
    key: 'accessTypeName',
    sorter: (a, b) => antdTableSorter(a, b, 'accessTypeName'),
    sortOrder: sortedInfo.columnKey === 'accessTypeName' && sortedInfo.order
  },
  {
    title: <IntlMessage id="component.table.column.phone" />,
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 220,
    render: (text) => phoneFormat(text)
  }
];

export const getCurrentUserActions = (handleAction = noop) => ({
  title: <IntlMessage id="component.table.column.actions" />,
  key: 'actions',
  align: 'center',
  render: (_, record) => (
    record?.accessType !== ROLES.SYSTEM_ADMIN && (
      <EllipsisDropdown
        icon={<EditOutlined />}
        menu={(
          <Menu
            onClick={({ key }) => {
              handleAction(key, record);
            }}>

            <Menu.Item key={USER_DASHBOARD_ACTIONS.EDIT_USER}>
              <IntlMessage id="component.common.edit.label" />
            </Menu.Item>
          </Menu>
              )} />
    )
  )

});
