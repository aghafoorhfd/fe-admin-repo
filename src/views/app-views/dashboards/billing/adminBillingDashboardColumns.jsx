import { Button, Tag } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getName } from 'utils/utils';
import { INVOICE_STATUS, USER_REGISTRATION_STATUS } from 'constants/MiscConstant';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

export const adminBillingDashboardColumns = (handleEditClick) => {
  const { NOT_PAID, OVERDUE } = INVOICE_STATUS;
  const { t } = useTranslation();
  return (
    [
      {
        key: 'clientName',
        dataIndex: 'clientName',
        title: t('component.admin.billing.dashboard.table.column.clientName'),
        width: 200,
        render: (_, record) => {
          const { customer: { firstName = '', lastName = '' } } = record;
          return getName(firstName, lastName);
        }
      },
      {
        key: 'organizationName',
        dataIndex: 'organizationName',
        title: t('component.admin.billing.dashboard.table.column.companyName'),
        width: 200,
        render: (_, record) => {
          const { customer: { organizationName = '' } } = record;
          return organizationName;
        }
      },
      {
        key: 'customer',
        dataIndex: ['customer', 'companyName'],
        title: t('component.product.admin.company.subDomain'),
        width: 200
      },
      {
        key: 'planType',
        dataIndex: 'planType',
        title: t('component.admin.billing.dashboard.table.column.clientType'),
        width: 200
      },
      {
        key: 'invoiceStatus',
        dataIndex: 'invoiceStatus',
        title: t('component.admin.billing.dashboard.table.column.invoiceStatus'),
        width: 200
      },
      {
        key: 'product',
        dataIndex: ['product', 'name'],
        title: t('component.admin.billing.dashboard.table.column.product'),
        width: 200,
        render: () => (t('component.common.status.pmo.tracker'))
      },
      {
        key: 'dateActivated',
        dataIndex: 'dateActivated',
        title: t('component.admin.billing.dashboard.table.column.dateActivated'),
        width: 200,
        render: (_, record) => {
          const { activatedDate } = record;
          return activatedDate ? moment(activatedDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) : '';
        }
      },
      {
        key: 'status',
        title: t('component.common.status.label'),
        width: 200,
        align: 'center',
        render: (_, record) => {
          const statusConfig = USER_REGISTRATION_STATUS[record.status];
          const getCircle = (fill) => (
            <svg viewBox="0 0 20 20" width="8px" height="8px" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill={fill} />
            </svg>
          );
          return (
            <Tag
              style={{ borderRadius: '50px' }}
              color={statusConfig?.tagColor}>
              <>
                <span className="mr-1">
                  {getCircle(statusConfig?.textColor)}
                </span>
                <span style={{ color: statusConfig?.textColor }}>
                  {t(statusConfig?.label)}
                </span>
              </>
            </Tag>
          );
        }
      },
      {
        key: 'billingCycle',
        dataIndex: 'billingCycle',
        title: t('component.common.label.billingCycle'),
        width: 200,
        render: (_, record) => {
          const { billingCycle = '' } = record;
          return billingCycle;
        }
      },
      {
        align: 'center',
        key: 'basePrice',
        dataIndex: 'basePrice',
        title: t('component.admin.billing.dashboard.table.column.rate'),
        width: 200,
        render: (_, record) => {
          const { basePrice } = record;
          return `$${basePrice || 0}`;
        }
      },
      {
        key: 'nextBillingDate',
        dataIndex: 'nextBillingDate',
        title: t('component.admin.billing.dashboard.table.column.nextBillingDate'),
        width: 200,
        render: (_, record) => {
          const { nextBillingDate } = record;
          return nextBillingDate ? moment(nextBillingDate).format('DD/MM/YYYY') : '';
        }
      },
      {
        align: 'center',
        key: 'totalLicenses',
        dataIndex: 'totalLicenses',
        title: t('component.admin.billing.dashboard.table.column.activeUsers'),
        width: 200
      },
      {
        key: 'revenue',
        dataIndex: 'revenue',
        title: t('component.admin.billing.dashboard.table.column.revenue'),
        width: 200
      },
      {
        align: 'center',
        title: t('component.table.column.actions'),
        dataIndex: 'revoke',
        key: 'revoke',
        width: 120,
        fixed: 'right',
        render: (_, record) => {
          const { invoiceStatus } = record;
          const isInvoiceOutstanding = invoiceStatus === NOT_PAID || invoiceStatus === OVERDUE;
          return (
            <Button
              disabled={isInvoiceOutstanding}
              type="secondary"
              onClick={() => handleEditClick(record)}>
              {t('component.common.edit.label')}
            </Button>
          );
        }
      }
    ]
  );
};
