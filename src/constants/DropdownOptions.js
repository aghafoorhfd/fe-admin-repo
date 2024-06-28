import i18n from 'i18next';

const { t } = i18n;

export const TABLE_ROWS = ['10', '20', '50', '100'];

export const BILLING_CYCLE_OPTIONS = [
  { label: t('component.product.admin.monthly'), value: 'Monthly' },
  { label: t('component.product.admin.yearly'), value: 'Yearly' },
  { label: t('component.pricing.package.type.freemium'), value: 'Free' }
];

export const PLAN_TYPE_OPTIONS = [
  { label: t('component.analytics.dropDown.web'), value: 'WEB' },
  { label: t('component.analytics.dropDown.b2b'), value: 'B2B' }
];

export const STATUS_OPTIONS = [
  { label: t('component.analytics.dropDown.active'), value: 'ACTIVE' },
  { label: t('component.analytics.dropDown.inActive'), value: 'IN_ACTIVE' }
];

export const USER_FORM_ACCESSTYPE = [
  {
    value: 'SALES',
    label: t('component.constant.dropDownOptions.sales')
  },
  {
    value: 'SUPPORT',
    label: t('component.constant.dropDownOptions.support')
  }
];
