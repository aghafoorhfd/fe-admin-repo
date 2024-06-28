import fetch from 'auth/FetchInterceptor';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import { USER, tenantId } from 'constants/RolesConstant';
import { removeItemFromLocalStorage } from 'utils/utils';
import {
  FORGOT_PASSWORD, REGISTER_USER,
  VERIFY_EMAIL, SET_CREDENTIALS, LOGIN, RESET_CREDENTIALS, USER_PROFILE, ADMIN_SERVICE_USERS
} from 'constants/ApiConstant';

const UserService = {
  login(data) {
    const { email, password } = data;
    return fetch({
      url: LOGIN,
      method: 'post',
      data: { userName: email, password },
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  register(data) {
    return fetch({
      url: REGISTER_USER,
      method: 'POST',
      data
    });
  },

  logout() {
    const keysToRemove = [AUTH_TOKEN, USER];
    keysToRemove.forEach((k) => removeItemFromLocalStorage(k));
  },

  forgotPassword(data) {
    const { email } = data;
    return fetch({
      url: FORGOT_PASSWORD,
      method: 'POST',
      data: email,
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  verifySetPasswordToken(token) {
    return fetch({
      url: `${VERIFY_EMAIL}?token=${token}`,
      method: 'get',
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  setPassword(data) {
    return fetch({
      url: data.newUser ? SET_CREDENTIALS : RESET_CREDENTIALS,
      method: data.newUser ? 'post' : 'put',
      data,
      headers: { 'X-TENANT-ID': tenantId }
    });
  },

  getUserProfileData() {
    return fetch({
      url: USER_PROFILE,
      method: 'get'
    });
  },

  addUser(data) {
    return fetch({
      url: ADMIN_SERVICE_USERS,
      method: 'post',
      data
    });
  },

  editUser(data) {
    return fetch({
      url: `${ADMIN_SERVICE_USERS}/${data?.id}`,
      method: 'put',
      data
    });
  },

  getAllUsers(pageNumber, pageSize, data = {}) {
    return fetch({
      url: `${ADMIN_SERVICE_USERS}/search/${pageNumber}/${pageSize}`,
      method: 'get',
      data
    });
  }

};
export default UserService;
