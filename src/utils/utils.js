import { range } from 'lodash';
import IntlMessage from 'components/util-components/IntlMessage';
import moment from 'moment';
import { BILLING_CYCLE_OPTIONS } from 'constants/DropdownOptions';

const [MONTHLY, YEARLY] = BILLING_CYCLE_OPTIONS;

export const getValueFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const setValuesToLocalStorage = (key, value) => {
  const data = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
};

export const removeItemFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const hasPermission = (allRoles, currentRole) => allRoles?.includes(currentRole);

export const antdTableSorter = (a1, b1, key) => {
  if (typeof a1[key] === 'string' && typeof b1[key] === 'string') {
    const a = a1[key].toLowerCase();
    const b = b1[key].toLowerCase();
    if (a > b) { return 1; }
    return b > a ? -1 : 0;
  }
};

/**
 * {dataList}: data array, can be array of primitive type ot array of object
 * {valueKey}: key to get value attribute from data object, required if dataList is array of object
 * {labelKey}: key to get label attribute from data object, required if dataList is array of object
 */
export const createOptionList = (dataList, valueKey, labelKey) => {
  try {
    if (Array.isArray(dataList)) {
      return dataList?.map((dataItem) => {
        let label;
        let value;
        if (typeof dataItem !== 'object') {
          label = dataItem;
          value = dataItem;
        } else {
          label = dataItem[labelKey];
          value = dataItem[valueKey];
        }
        return { label, value };
      });
    }
    return [];
  } catch (err) {
    return [];
  }
};

export const findBy = (finderKey, finderVal, array) => (
  array.find((obj) => finderVal === obj[finderKey])
);

export const preProcessingData = (globalData = [], companyData = {}) => {
  const globalDataList = globalData?.map(
    (title, index) => ({ key: index + 1, title, disabled: true })
  ) || [];
  const globalDataListLength = globalDataList.length + 1;

  // processing companyData Data to pass in the Transfer Component
  const companyDataList = companyData?.selected?.map(
    (title, index) => ({ key: globalDataListLength + index, title })
  ) || [];
  const newDataLength = globalDataListLength + companyDataList.length;
  const companyDataListNotSelected = companyData?.notSelected?.map(
    (title, index) => ({
      key: newDataLength + index,
      title
    })
  ) || [];
  // generating TargetKeys to show selected Milestones in the Right side tab
  const targetKeys = range(1, (globalDataListLength
    + companyDataList.length));
  return [[...globalDataList, ...companyDataList, ...companyDataListNotSelected], targetKeys];
};

export const getFilteredItem = (dropList, selectedList) => {
  if (Array.isArray(selectedList)) {
    const fileredItems = dropList?.filter((item) => {
      const id = item?.id || item?.projectId;
      const found = selectedList?.some((selectedId) => id === selectedId);
      return found;
    });
    return fileredItems;
  }
};

// Function will return the data that needs to be passed in the End point
export const getMetricsData = (data, keys, globalMetricLength) => {
  const filterSelectedData = (acc, curr) => {
    if (curr.key > globalMetricLength && keys.includes(curr.key)) {
      return [...acc, curr.title];
    }
    return acc;
  };

  const filterNotSelectedData = (acc, curr) => {
    if (!keys.includes(curr.key)) {
      return [...acc, curr.title];
    }
    return acc;
  };

  return {
    selected: data.reduce(filterSelectedData, []),
    notSelected: data.reduce(filterNotSelectedData, [])
  };
};

export const getMetricsArray = (arr = []) => (arr?.length ? arr : []);

export const phoneFormat = (input) => {
  if (!input || Number.isNaN(input) || input.length < 11) return <IntlMessage id="component.common.notAvailable" />;
  const code = input.slice(0, input.length - 10);
  const number = input.slice(code.length);
  return `+${code} ${number.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3')}`;
};

export const phoneisValid = ({ phone, code }) => {
  const reg = /^\d+$/;
  return !!code && phone?.length === 10 && reg.test(phone);
};

export const getFilterURI = (filterValues = {}, formattedValues = {}) => {
  const appliedFilters = { ...filterValues, ...formattedValues };
  const valueAbleKeys = Object.keys(appliedFilters)?.length
    && Object.keys(appliedFilters).filter((key) => appliedFilters[key] !== undefined);

  if (valueAbleKeys?.length) {
    const uriArr = valueAbleKeys.map((key) => `${key}|${appliedFilters[key]}`);
    return encodeURIComponent(uriArr.join('&'));
  }

  return '';
};

export const removeUndefinedProperties = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
);

export const capitalize = (value) => (value.charAt(0).toUpperCase() + value.slice(1));

export const getRemainingLicenses = (companyData) => {
  const { totalLicenses = 0, usedLicenses = 0 } = companyData || {};
  return totalLicenses - usedLicenses;
};

export const getName = (fName, lName) => (fName ? (`${fName} `) : '') + lName;

export const disableDates = (current, selectedValue, billingDate) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const dayOfCurrentMonth = moment(currentDate, 'YYYY-MM-DD');
  const dayOfNextMonth = dayOfCurrentMonth.clone().add(1, 'month');
  const dayOfNextYear = dayOfCurrentMonth.clone().add(1, 'year');

  const checkDatesToDisable = (day, month, year) => (
    current.isBefore(day, 'day')
    || current.isSame(day, 'day')
    || current.isAfter(month, 'day')
    || current.isAfter(year, 'day')
    || (current.date() >= 29 && current.date() <= 31)
  );

  if (billingDate && selectedValue) {
    let disabledDateAfterBillingDate;
    if (selectedValue === MONTHLY.value) {
      disabledDateAfterBillingDate = moment(billingDate).add(31, 'days').startOf('day');
    } else if (selectedValue === YEARLY.value) {
      disabledDateAfterBillingDate = moment(billingDate).add(1, 'years').startOf('day');
    }
    return current.isAfter(disabledDateAfterBillingDate) || current.isBefore(billingDate);
  }

  if (selectedValue === MONTHLY.value
    && checkDatesToDisable(dayOfCurrentMonth, dayOfNextMonth, null)) {
    return true;
  }

  if (selectedValue === YEARLY.value
    && checkDatesToDisable(dayOfCurrentMonth, null, dayOfNextYear)) {
    return true;
  }

  return false;
};

export const getWebPlanBillingDate = () => {
  const currentDate = moment();
  const currentDayOfMonth = currentDate.date();
  const defaultBillingDate = currentDayOfMonth < 5 ? moment().date(5)
    : moment().add(1, 'months').date(5);
  return defaultBillingDate;
};

export const disableNumberFieldScroll = (e) => e.target.addEventListener('wheel', (ev) => { ev.preventDefault(); }, { passive: false });

export const getSubdomain = (url) => {
  const matches = url.match(/^(https?:\/\/)?([^/]+)\//);
  if (matches && matches.length >= 3) {
    const domainParts = matches[2].split('.');
    if (domainParts.length >= 2) {
      return domainParts[0];
    }
  }
  return '';
};
