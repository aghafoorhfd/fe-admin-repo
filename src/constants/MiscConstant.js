import i18n from 'i18next';
import IntlMessage from 'components/util-components/IntlMessage';

const { t } = i18n;

export const PLAN_STATUS = {
  ACTIVE: <IntlMessage id="component.customer.activation.status.active" />,
  IN_ACTIVE: <IntlMessage id="component.customer.activation.status.inActive" />
};

export const ROLES_ACCESS_TYPES = {
  SYSTEM_ADMIN: { key: 'SYSTEM_ADMIN', value: t('component.user.dashboard.role.superAdmin') },
  SALES: { key: 'SALES', value: t('component.user.dashboard.role.sales') },
  SUPPORT: { key: 'SUPPORT', value: t('component.user.dashboard.role.support') }
};

export const ERROR_CODE = '9999';

export const initialPaginationConfiguration = { page: 1, pageSize: 10 };

export const TOKEN_EXPIRE_ERROR_CODE = ['1002', '9999'];

export const FEATURES = {
  jiraIntegration: 'Jira Integration',
  rallyIntegration: 'Rally IntegrationP',
  corporateProfileManager: 'Corporate Profile Manager',
  resourceManager: 'Resource Manager',
  okrManager: 'OKR Manager',
  conflictManager: 'Conflict Manager',
  executiveDashboard: 'Executive Dashboard',
  projectManager: 'Project Manager',
  budgetManager: 'Budget Manager',
  quarterlyPlanner: 'Quarterly Planner',
  confluenceIntegration: 'Confluence Integration'
};

export const INVOICE_STATUS = {
  NOT_PAID: 'NOT_PAID',
  OVERDUE: 'OVERDUE'
};

export const PROJECT_TIMELINES_METRICS = {
  STAGES: 'stages',
  MILESTONES: 'milestones',
  DEPENDENCY: 'dependency'
};

export const USER_DASHBOARD_ACTIONS = {
  EDIT_USER: 'edit',
  DELETE: 'delete'
};

export const USER_REGISTRATION_STATUS = {
  ACTIVE: {
    key: 'ACTIVE',
    label: 'component.admin.billing.dashboard.active',
    tagColor: '#ECFDF3',
    textColor: '#027A48'
  },
  IN_ACTIVE: {
    key: 'IN_ACTIVE',
    label: 'component.admin.billing.dashboard.inActive',
    tagColor: '#FEF3F2',
    textColor: '#B42318'
  }
};

export const PLAN_ACTIONS = {
  EDIT_PLAN: 'edit-plan',
  DELETE_PLAN: 'delete-plan',
  ADD_EDIT_SCREEN_PRIVILEGES: 'add-edit-screen-privileges'
};

export const INVITATION_STATUS = {
  SEND_INVITATION: <IntlMessage id="component.customer.activation.table.sendInvite" />
};

export const CUSTOMER_ACTIVATION_ACTIONS = {
  SEND_INVITE: 'send-invite'
};

export const addScreenExamples = [{
  admin: 'admin/',
  dashboard: 'admin/dashboard',
  user: 'admin/dashboard/user'
}];

export const BILLING_OPTIONS = {
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
  FREE: 'Free'
};

export const INVITATION_STATUS_VERIFIED = 'INVITATION_VERIFIED';
