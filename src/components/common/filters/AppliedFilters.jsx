import {
  Card, Col, Row, Tag
} from 'antd';
import React from 'react';
import useFilter from 'utils/hooks/useFilter';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH } from 'constants/DateConstant';

const spaceAround = (str) => (str ? ` ${str} ` : null);

const FilterBiscuit = ({
  appliedFilters, filterKey, color, options
}) => {
  const formatDate = (list) => list.map((date) => moment(
    date
  ).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH));

  return (
    <Tag color={color}>
      <span className="text-uppercase font-weight-bold mr-1">
        {options?.name || filterKey}
        :
      </span>
      {Array.isArray(appliedFilters[filterKey]) ? formatDate(appliedFilters[filterKey]).join(spaceAround(options?.separator) || ', ') : appliedFilters[filterKey]}

    </Tag>
  );
};

const AppliedFilters = ({ name, tagColor, options }) => {
  const [appliedFilters] = useFilter(name);
  const formFilters = appliedFilters?.applied || {};
  const formattedFilters = appliedFilters?.formatted || {};

  const applied = { ...formFilters, ...formattedFilters };
  return (
    Object.keys(applied)?.length
      ? (
        <Card>
          <Row gutter={[4, 4]} justify="end">
            { Object.keys(applied).map((key) => (
              <Col key={`col-${key}`}>
                <FilterBiscuit
                  key={key}
                  appliedFilters={applied}
                  filterKey={key}
                  color={tagColor}
                  options={options[key]} />
              </Col>
            ))}
          </Row>
        </Card>
      )
      : null
  );
};
AppliedFilters.propTypes = {
  name: PropTypes.string.isRequired,
  tagColor: PropTypes.string,
  options: PropTypes.objectOf(PropTypes.shape(
    {
      name: PropTypes.string,
      separator: PropTypes.string
    }
  ))
};
AppliedFilters.defaultProps = {
  tagColor: 'green',
  options: {}
};

export default AppliedFilters;
