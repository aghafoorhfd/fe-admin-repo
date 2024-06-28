import fetch from 'auth/FetchInterceptor';
import { SUBSCRIPTION_SERVICE } from 'constants/ApiConstant';
import AdminService from './AdminService';

jest.mock('auth/FetchInterceptor');
jest.mock('utils/utils');

describe('Subscription Service', () => {
  afterEach(() => jest.clearAllMocks());
  it('should call get Web Plans ', () => {
    AdminService.getPlans();

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/plans/web`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get All Customer Plans ', () => {
    AdminService.getAllCustomersPlans(1, 1);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${SUBSCRIPTION_SERVICE}/plans/customers/1/1`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
});
