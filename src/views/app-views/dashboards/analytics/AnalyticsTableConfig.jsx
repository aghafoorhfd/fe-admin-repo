import i18n from 'i18next';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FEATURES } from 'constants/MiscConstant';
import { getName } from 'utils/utils';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

const { t } = i18n;
export const getColumns = (diplayFeatures) => [
  {
    title: t('component.analytics.table.column.profileType'),
    children: [
      {
        title: t('component.admin.billing.dashboard.table.column.clientName'),
        dataIndex: 'userName',
        key: 'userName',
        width: 140,
        render: (_, record) => {
          const { customer: { firstName = '', lastName = '' } } = record;
          return getName(firstName, lastName);
        }
      },
      {
        key: 'organizationName',
        dataIndex: ['customer', 'organizationName'],
        title: t('component.admin.billing.dashboard.table.column.companyName'),
        width: 200
      },
      {
        title: t('component.product.admin.company.subDomain'),
        dataIndex: ['customer', 'companyName'],
        key: 'customer',
        width: 150
      },
      {
        title: t('component.analytics.table.column.profileType.type'),
        dataIndex: 'planType',
        key: 'planType',
        width: 131
      },
      {
        title: t('component.analytics.table.column.profileType.activate'),
        dataIndex: 'activatedDate',
        key: 'activatedDate',
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
        width: 131
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
        title: t('component.analytics.table.column.license.users'),
        dataIndex: 'totalLicenses',
        key: 'users',
        width: 131
      }
    ]
  },
  {
    title: t('component.analytics.table.column.features'),
    className: 'features-column',
    children: [
      {
        align: 'center',
        title: t('component.analytics.table.column.features.jiraIntegration'),
        dataIndex: 'jiraIntegration',
        key: 'jiraIntegration',
        className: 'features-column',
        width: 150,
        render: (_, record) => {
          const { planFeatureNames } = record;
          return planFeatureNames?.includes(FEATURES.jiraIntegration) ? (
            <CheckOutlined
              style={{ color: '#6BC24A', fontSize: '22px' }} />
          ) : (
            <CloseOutlined
              style={{ color: '#FF0000', fontSize: '22px' }} />
          );
        }
      },
      {
        align: 'center',
        title: t(
          'component.analytics.table.column.features.rallyIntegration'
        ),
        dataIndex: 'rallyIntegration',
        key: 'rallyIntegration',
        className: 'features-column',
        width: 150,
        render: (_, record) => {
          const { planFeatureNames } = record;
          return planFeatureNames?.includes(FEATURES.rallyIntegration) ? (
            <CheckOutlined
              style={{ color: '#6BC24A', fontSize: '22px' }} />
          ) : (
            <CloseOutlined
              style={{ color: '#FF0000', fontSize: '22px' }} />
          );
        }
      },
      {
        align: 'center',
        title: t(
          'component.analytics.table.column.features.corporateProfileManager'
        ),
        dataIndex: 'corporateProfileManager',
        key: 'corporateProfileManager',
        className: 'features-column',
        width: 150,
        render: (_, record) => {
          const { planFeatureNames } = record;
          return planFeatureNames?.includes(
            FEATURES.corporateProfileManager
          ) ? (
            <CheckOutlined
              style={{ color: '#6BC24A', fontSize: '22px' }} />
            ) : (
              <CloseOutlined
                style={{ color: '#FF0000', fontSize: '22px' }} />
            );
        }
      },
      ...(diplayFeatures
        ? [
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.resourceManager'
            ),
            dataIndex: 'resourceManager',
            key: 'resourceManager',
            className: 'features-column',
            width: 152,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(FEATURES.resourceManager) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
              ) : (
                <CloseOutlined
                  style={{ color: '#FF0000', fontSize: '22px' }} />
              );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.okrManager'
            ),
            dataIndex: 'okrManager',
            key: 'okrManager',
            className: 'features-column',
            width: 152,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(FEATURES.okrManager) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
              ) : (
                <CloseOutlined
                  style={{ color: '#FF0000', fontSize: '22px' }} />
              );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.conflictManager'
            ),
            dataIndex: 'conflictManager',
            key: 'conflictManager',
            className: 'features-column',
            width: 150,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(FEATURES.conflictManager) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
              ) : (
                <CloseOutlined
                  style={{ color: '#FF0000', fontSize: '22px' }} />
              );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.executiveDashboard'
            ),
            dataIndex: 'executiveDashboard',
            key: 'executiveDashboard',
            className: 'features-column',
            width: 165,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(
                FEATURES.executiveDashboard
              ) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
                ) : (
                  <CloseOutlined
                    style={{ color: '#FF0000', fontSize: '22px' }} />
                );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.projectManager'
            ),
            dataIndex: 'projectManager',
            key: 'projectManager',
            className: 'features-column',
            width: 150,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(FEATURES.projectManager) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
              ) : (
                <CloseOutlined
                  style={{ color: '#FF0000', fontSize: '22px' }} />
              );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.budgetManager'
            ),
            dataIndex: 'budgetManager',
            key: 'budgetManager',
            className: 'features-column',
            width: 150,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(FEATURES.budgetManager) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
              ) : (
                <CloseOutlined
                  style={{ color: '#FF0000', fontSize: '22px' }} />
              );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.quarterlyPlanner'
            ),
            dataIndex: 'quarterlyPlanner',
            key: 'quarterlyPlanner',
            className: 'features-column',
            width: 150,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(
                FEATURES.quarterlyPlanner
              ) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
                ) : (
                  <CloseOutlined
                    style={{ color: '#FF0000', fontSize: '22px' }} />
                );
            }
          },
          {
            align: 'center',
            title: t(
              'component.analytics.table.column.features.confluenceIntegration'
            ),
            dataIndex: 'confluenceIntegration',
            key: 'confluenceIntegration',
            className: 'features-column',
            width: 177,
            render: (_, record) => {
              const { planFeatureNames } = record;
              return planFeatureNames?.includes(
                FEATURES.confluenceIntegration
              ) ? (
                <CheckOutlined
                  style={{ color: '#6BC24A', fontSize: '22px' }} />
                ) : (
                  <CloseOutlined
                    style={{ color: '#FF0000', fontSize: '22px' }} />
                );
            }
          }
        ]
        : [])
    ]
  }
];
