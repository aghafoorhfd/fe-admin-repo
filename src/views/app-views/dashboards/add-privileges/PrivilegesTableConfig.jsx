import { useTranslation } from 'react-i18next';
import {
  EditOutlined
} from '@ant-design/icons';

export const getPrivilegeColumns = (handleAction) => {
  const { t } = useTranslation();
  return (
    [
      {
        key: 'name',
        dataIndex: 'name',
        title: t('component.admin.privileges.add.privilege.label'),
        width: 200
      },
      {
        key: 'description',
        dataIndex: 'description',
        title: t('component.admin.privileges.add.description.label'),
        width: 200
      },
      {
        key: 'url',
        dataIndex: 'url',
        title: t('component.admin.privileges.add.url.label'),
        width: 200
      },
      {
        align: 'center',
        title: t('component.table.column.actions'),
        width: 120,
        render: (_, record) => (
          <EditOutlined onClick={() => {
            handleAction(record);
          }} />

        )
      }
    ]
  );
};
