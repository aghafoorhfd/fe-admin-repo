import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';
import { RESET_SLICE } from 'store/actions/resetSlice';
import { initialPaginationConfiguration as defaultPagination } from 'constants/MiscConstant';
import { STATUS } from 'constants/StatusConstant';
import UserService from '../../services/UserService';

const { SUCCESS, ERROR } = STATUS;
const { t } = i18n;
export const initialState = {
  loading: false,
  users: {},
  message: '',
  showMessage: false,
  status: '',
  isFormVisible: false,
  filter: {
    pageNumber: defaultPagination.page,
    pageSize: defaultPagination.pageSize
  }
};

export const getUsers = createAsyncThunk('userService/getUsers', async (data, { rejectWithValue }) => {
  const { pageNumber: page, pageSize: size } = data;

  try {
    const response = await UserService.getAllUsers(
      page - 1,
      size
    );
    const { data: usersList } = response;
    return { usersList, page, size };
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const addUser = createAsyncThunk('userService/addUser', async (data, { rejectWithValue }) => {
  try {
    return await UserService.addUser(data);
  } catch (error) {
    const { message, code } = error;

    let displayMessage;
    if (code === '1028') {
      const [, userMessage] = message.split(':');
      displayMessage = userMessage || message;
    } else {
      displayMessage = message;
    }
    const errorMessage = displayMessage || 'Something went wrong';
    return rejectWithValue(errorMessage);
  }
});

export const editUser = createAsyncThunk('userService/editUser', async (formEditValues, { rejectWithValue }) => {
  try {
    return await UserService.editUser(formEditValues);
  } catch (error) {
    const { message } = error;
    return rejectWithValue(message || 'Something went wrong');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    showLoading: (state, action) => ({ ...state, loading: action.payload.loading }),
    hideUserMessage: (state) => ({ ...state, message: '', showMessage: false }),
    resetStatus: (state) => ({ ...state, status: '' }),
    toggleForm: (state, action) => ({
      ...state,
      isFormVisible: typeof (action.payload) === 'boolean' ? action.payload : !state.isFormVisible
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(RESET_SLICE, () => (initialState)) // call on logout
      .addCase(getUsers.pending, (state) => ({ ...state, loading: true }))
      .addCase(getUsers.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        users: action.payload.usersList,
        filter: { pageNumber: action.payload.page, pageSize: action.payload.size }
      }))
      .addCase(getUsers.rejected, (state, action) => ({
        ...state,
        users: {},
        message: action.payload,
        showMessage: true,
        loading: false,
        status: ERROR
      }))
      .addCase(addUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(addUser.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.userAdded.success.message'),
        status: SUCCESS,
        isFormVisible: false,
        resourceId: action.payload?.data?.id
      }))
      .addCase(addUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }))
      .addCase(editUser.pending, (state) => ({ ...state, loading: true }))
      .addCase(editUser.fulfilled, (state) => ({
        ...state,
        loading: false,
        showMessage: true,
        message: t('component.user.dashboard.userEdit.success.message'),
        status: SUCCESS,
        isFormVisible: false
      }))
      .addCase(editUser.rejected, (state, action) => ({
        ...state,
        showMessage: true,
        message: action.payload,
        loading: false,
        status: ERROR,
        isFormVisible: true
      }));
  }
});

export const {
  showLoading, hideUserMessage, toggleForm, resetStatus
} = userSlice.actions;

export default userSlice.reducer;
