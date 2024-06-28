import i18n from 'i18next';
import moment from 'moment';
import {
  CUSTOMER_ACTIVATION_ACTIONS, INVITATION_STATUS, INVITATION_STATUS_VERIFIED, PLAN_STATUS
} from 'constants/MiscConstant';
import { getName } from 'utils/utils';
import { Button } from 'antd';
import { noop } from 'lodash';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

const { t } = i18n;
export const getColumns = (handleAction = noop) => [
  {
    title: t('component.analytics.table.column.profileType'),
    children: [
      {
        title: t('component.analytics.table.column.profileType.type'),
        dataIndex: 'planType',
        key: 'planType',
        width: 131
      },
      {
        title: 'Company Name',
        dataIndex: 'organizationName',
        key: 'name',
        width: 131,
        render: (_, record) => (record.customer.organizationName)
      },
      {
        title: t('component.analytics.table.column.profileType.name'),
        dataIndex: 'customerName',
        key: 'customerName',
        width: 131,
        render: (_, record) => {
          const { customer } = record;
          let fName = '';
          let lName = '';
          fName = customer?.firstName;
          lName = customer?.lastName;
          return getName(fName, lName);
        }
      },
      {
        title: t('component.analytics.table.column.profileType.activate'),
        dataIndex: 'billingDate',
        key: 'billingDate',
        width: 131,
        render: (_, record) => {
          const { activatedDate } = record;
          return activatedDate ? moment(activatedDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH) : '';
        }
      }
    ]
  },
  {
    title: t('component.analytics.table.column.billing'),
    className: 'billing-column',
    children: [
      {
        title: t('component.common.status.label'),
        dataIndex: 'status',
        key: 'status',
        className: 'billing-column',
        width: 131,
        render: (_, record) => {
          const { status } = record;
          return PLAN_STATUS[status];
        }
      },
      {
        title: t('component.common.label.billingCycle'),
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        className: 'billing-column',
        width: 131
      }
    ]
  },
  {
    title: t('component.analytics.table.column.license'),
    align: 'center',
    children: [
      {
        align: 'center',
        title: t('component.analytics.table.column.license.count'),
        dataIndex: 'totalLicenses',
        key: 'totalLicenses',
        width: 131
      }
    ]
  },
  {
    title: t('component.customer.activation.table.column.actions'),
    align: 'center',
    children: [
      {
        title: t('component.customer.activation.table.column.invite'),
        dataIndex: 'invitationStatus',
        key: 'invitationStatus',
        width: 150,
        align: 'center',
        render: (_, record) => (
          <Button
            disabled={record.customer.invite === INVITATION_STATUS_VERIFIED}
            type="link"
            onClick={() => {
              handleAction(CUSTOMER_ACTIVATION_ACTIONS.SEND_INVITE, record);
            }}>
            {INVITATION_STATUS.SEND_INVITATION}
          </Button>
        )
      }
    ]
  }
];
