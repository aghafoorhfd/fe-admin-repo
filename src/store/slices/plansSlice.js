import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { initialPaginationConfiguration as defaultPagination } from 'constants/MiscConstant';
import { STATUS } from 'constants/StatusConstant';
import AdminService from 'services/AdminService';
import { toLower, startCase } from 'lodash';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
export const initialState = {
  loading: false,
  rolePrivilegesLoading: false,
  plansList: [],
  message: '',
  showMessage: false,
  status: '',
  isFormVisible: false,
  featureOptions: [],
  userRoleOptions: [],
  pmoScreenPrivileges: [],
  userScreenOptions: [],
  userScreenPrivileges: [],
  paymentCycle: [],
  filter: {
    pageNumber: defaultPagination.page,
    pageSize: defaultPagination.pageSize
  }
};

export const getPlans = createAsyncThunk('planService/getPlans', async (data, { rejectWithValue }) => {
  const { pageNumber: page, pageSize: size } = data;

  try {
    const response = await AdminService.getAllWebPlans(
      page - 1,
      size
    );
    const { data: plansList } = response;
    return { plansList, page, size };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addPlan = createAsyncThunk('planService/addPlan', async (data, { rejectWithValue }) => {
  try {
    return await AdminService.addPlan(data);
  } catch (error) {
    const { message, code } = error;

    let displayMessage;
    if (code === '1028') {
      const [, planMessage] = message.split(':');
      displayMessage = planMessage || message;
    } else {
      displayMessage = message;
    }
    const errorMessage = displayMessage || 'Something went wrong';
    return rejectWithValue(errorMessage);
  }
});

export const editPlan = createAsyncThunk('planService/editPlan', async (formEditValues, { rejectWithValue }) => {
  try {
    return await AdminService.editPlan(formEditValues);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const deletePlan = createAsyncThunk('planService/deletePlan', async (planID, { rejectWithValue }) => {
  try {
    return await AdminService.deletePlan(planID);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getFeatures = createAsyncThunk('planService/getFeatures', async (_, { rejectWithValue }) => {
  try {
    const response = await AdminService.getFeatures();
    const { data = [] } = response;
    const featureList = data?.map((list) => ({
      label: list?.name,
      value: list?.id
    }));
    return featureList;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserRolesAndPrivileges = createAsyncThunk('planService/getUserRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await AdminService.getUserRolesAndPrivileges();
    const {
      data: {
        pmoAccessTypeList: accessTypeList,
        pmoScreenList: screenList
      } = {}
    } = response;
    const userRoleList = accessTypeList?.map((list) => ({
      label: startCase(toLower(list?.name)),
      value: list?.id
    }));
    const featureList = screenList?.map((list) => ({
      label: list?.name,
      value: list?.id
    }));
    return { userRoleList, featureList, screenList };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addUserScreenPriviliges = createAsyncThunk('planService/getUserSceens', async (
  data,
  { rejectWithValue }
) => {
  try {
    return await AdminService.addUserScreenPriviliges(data);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getUserScreenPrivileges = createAsyncThunk('planService/getUserPrivileges', async (planID, { rejectWithValue }) => {
  try {
    const response = await AdminService.getUserScreenPrivileges(planID);
    const { data = [] } = response;
    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const getPaymentCycle = createAsyncThunk('planService/getPaymentCycle', async (_, { rejectWithValue }) => {
  try {
    const response = await AdminService.getPaymentCycle();
    const { data = [] } = response;
    return data;
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    showLoading: (state, action) => ({ ...state, loading: action.payload.loading }),
    hidePlanMessage: (state) => ({ ...state, message: '', showMessage: false }),
    resetStatus: (state) => ({ ...state, status: '' }),
    resetUserScreenPrivileges: (state) => ({
      ...state,
      featureOptions: [],
      userRoleOptions: [],
      pmoScreenPrivileges: [],
      userScreenOptions: [],
      userScreenPrivileges: []
    }),
    toggleForm: (state, action) => ({
      ...state,
      isFormVisible: typeof (action.payload) === 'boolean' ? action.payload : !state.isFormVisible
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getPlans.pending, (state) => ({ ...state, loading: true }))
      .addCase(getPlans.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        plansList: action.payload.plansList,
        filter: { pageNumber: action.payload.page, pageSize: action.payload.size }
      }))
      .addCase(getPlans.rejected, (state, action) => ({
        ...state,
        plansList: [],
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }))
      .addCase(addPlan.pending, (state) => ({ ...state, loading: true }))
      .addCase(addPlan.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.plan.dashboard.planAdded.success.message'),
        status: SUCCESS,
        isFormVisible: false,
        resourceId: action.payload?.data?.id
      }))
      .addCase(addPlan.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(editPlan.pending, (state) => ({ ...state, loading: true }))
      .addCase(editPlan.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.plan.dashboard.planEdit.success.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(deletePlan.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR
      }))
      .addCase(deletePlan.pending, (state) => ({ ...state, loading: true }))
      .addCase(deletePlan.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.plan.dashboard.planDelete.success.message'),
        status: SUCCESS
      }))
      .addCase(editPlan.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(getFeatures.pending, (state) => ({
        ...state, loading: true
      }))
      .addCase(getFeatures.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        featureOptions: action.payload
      }))
      .addCase(getFeatures.rejected, (state, action) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: action.payload
      }))
      .addCase(getUserRolesAndPrivileges.pending, (state) => ({
        ...state, rolePrivilegesLoading: true
      }))
      .addCase(getUserRolesAndPrivileges.fulfilled, (state, { payload }) => ({
        ...state,
        rolePrivilegesLoading: false,
        userRoleOptions: payload.userRoleList,
        userScreenOptions: payload.featureList,
        pmoScreenPrivileges: payload.screenList
      }))
      .addCase(getUserRolesAndPrivileges.rejected, (state, action) => ({
        ...state,
        rolePrivilegesLoading: false,
        showMessage: true,
        status: ERROR,
        message: action.payload
      }))
      .addCase(addUserScreenPriviliges.pending, (state) => ({ ...state, loading: true }))
      .addCase(addUserScreenPriviliges.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.admin.addRolePrivileges.success.message'),
        status: SUCCESS
      }))
      .addCase(addUserScreenPriviliges.rejected, (state, action) => ({
        ...state,
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }))
      .addCase(getUserScreenPrivileges.pending, (state) => ({
        ...state, rolePrivilegesLoading: true
      }))
      .addCase(getUserScreenPrivileges.fulfilled, (state, { payload }) => ({
        ...state,
        rolePrivilegesLoading: false,
        userScreenPrivileges: payload
      }))
      .addCase(getUserScreenPrivileges.rejected, (state, action) => ({
        ...state,
        rolePrivilegesLoading: false,
        showMessage: true,
        status: ERROR,
        message: action.payload
      }))
      .addCase(getPaymentCycle.pending, (state) => ({ ...state, loading: true }))
      .addCase(getPaymentCycle.fulfilled, (state, { payload }) => (
        { ...state, paymentCycle: payload, loading: false }))
      .addCase(getPaymentCycle.rejected, (state, { payload }) => ({
        ...state, message: payload, showMessage: true, loading: false
      }));
  }
});

export const {
  showLoading, hidePlanMessage, toggleForm, resetStatus, resetUserScreenPrivileges
} = planSlice.actions;

export default planSlice.reducer;
