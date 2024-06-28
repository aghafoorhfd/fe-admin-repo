import fetch from 'auth/FetchInterceptor';
import { ADMIN_SERVICE_CUSTOMERS, ADMIN_SERVICE_PLANS, SUBSCRIPTION_SERVICE } from 'constants/ApiConstant';

const AdminService = {
  addPlan(data) {
    return fetch({
      url: `${ADMIN_SERVICE_PLANS}`,
      method: 'post',
      data
    });
  },

  upgradePlan(data) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/upgrade-enterprise-plan`,
      method: 'put',
      data
    });
  },

  editPlan(data) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans`,
      method: 'put',
      data
    });
  },

  deletePlan(planId) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/${planId}`,
      method: 'delete'
    });
  },
  getUserRolesAndPrivileges() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/screen-privilege/role-screens`,
      method: 'get'
    });
  },
  addUserScreenPriviliges({ rolePrivileges, planID }) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/screen-privilege/${planID}`,
      method: 'post',
      data: rolePrivileges
    });
  },
  addScreenPrivileges(data) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/screen-privilege/screen`,
      method: 'post',
      data
    });
  },
  updateScreenPrivileges(data) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/screen-privilege/screen`,
      method: 'put',
      data
    });
  },
  getUserScreenPrivileges(planID) {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/screen-privilege/${planID}`,
      method: 'get'
    });
  },
  getAllCustomersPlans(pageNumber, pageSize, uri = '', status = '') {
    const statusFilter = status ? `status=${status}` : '';
    const statusExcludedURI = decodeURIComponent(uri).split('&').filter((val) => !val.includes('status')).join('&');

    const filterAnd = statusExcludedURI ? `filterAnd=${encodeURIComponent(statusExcludedURI)}` : '';
    const filters = [filterAnd, statusFilter].filter(Boolean).join('&');
    return fetch({
      url: `${ADMIN_SERVICE_PLANS}/${pageNumber}/${pageSize}?${filters}`,
      method: 'get'
    });
  },

  getAllB2BPlans(pageNumber, pageSize, uri = '', status = '') {
    const statusFilter = status ? `status=${status}` : '';
    const statusExcludedURI = decodeURIComponent(uri).split('&').filter((val) => !val.includes('status')).join('&');

    const filterAnd = `filterAnd=${encodeURIComponent(statusExcludedURI ? `plan|B2B&${statusExcludedURI}` : 'plan|B2B')}`;
    const filters = [filterAnd, statusFilter].filter(Boolean).join('&');
    return fetch({
      url: `${ADMIN_SERVICE_PLANS}/${pageNumber}/${pageSize}?${filters}`,
      method: 'get'
    });
  },

  getAllWebPlans() {
    return fetch({
      url: `${SUBSCRIPTION_SERVICE}/plans/web?isAdmin=true`,
      method: 'get'
    });
  },

  getFeatures() {
    return fetch({
      url: `${ADMIN_SERVICE_PLANS}/features`,
      method: 'get'
    });
  },
  sendInvite(customerId) {
    return fetch({
      url: `${ADMIN_SERVICE_CUSTOMERS}/${customerId}/resend-invite`,
      method: 'POST'
    });
  },
  getPaymentCycle() {
    return fetch({
      url: `${ADMIN_SERVICE_PLANS}/payment-cycle`,
      method: 'get'
    });
  }

};
export default AdminService;
