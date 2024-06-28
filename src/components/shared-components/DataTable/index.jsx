import React, { useState } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { TABLE_ROWS } from 'constants/DropdownOptions';
import { initialPaginationConfiguration } from 'constants/MiscConstant';
import './index.css';
import CustomPagination from './Pagination';

const { page, pageSize: pageLimit } = initialPaginationConfiguration;
/*
  Wrapper component for the Data Table
*/
const DataTable = ({
  columns, currentPage, dataI, id, data, handleChange, loading, pageSize,
  showPagination, totalElements, ...props
}) => {
  const tablePagination = showPagination ? ({
    defaultPageSize: pageSize,
    pageSize,
    current: currentPage,
    pageSizeOptions: TABLE_ROWS,
    showSizeChanger: false,
    total: totalElements
  }) : null;

  const tableSorter = {
    column: undefined,
    columnKey: undefined,
    field: undefined,
    order: false
  };
  const [pagingAndSortingData, setPagingAndSortingData] = useState({
    paging: tablePagination,
    sort: tableSorter
  });

  const changeHandler = (paging, filter, sort) => {
    setPagingAndSortingData({
      paging,
      sort
    });
    handleChange(paging, filter, sort);
  };

  return (
    <>
      <Table
        data-i={dataI ? `${dataI}-data-table` : 'data-table'}
        rowKey={(record) => record[id]}
        scroll={{ y: 400 }}
        loading={loading}
        columns={columns}
        dataSource={data}
        onChange={(_, filter, sort) => changeHandler(pagingAndSortingData.paging, filter, sort)}
        pagination={false}
        {...props} />
      {
          showPagination && (
          <CustomPagination
            pagination={tablePagination}
            onChange={(pagination) => changeHandler(pagination, null, pagingAndSortingData.sort)} />
          )
      }
    </>
  );
};

DataTable.propTypes = {
  currentPage: PropTypes.number,
  columns: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  id: PropTypes.string,
  handleChange: PropTypes.func,
  pageSize: PropTypes.number,
  showPagination: PropTypes.bool,
  totalElements: PropTypes.number
};

DataTable.defaultProps = {
  currentPage: page,
  id: 'id',
  pageSize: pageLimit,
  handleChange: noop,
  showPagination: false,
  totalElements: 0
};

export default DataTable;
