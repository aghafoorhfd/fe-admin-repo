import { DeleteOutlined } from '@ant-design/icons';
import { Row, Transfer } from 'antd';
import { noop } from 'lodash';
import { useEffect, useState } from 'react';
import './index.css';

const DataTransfer = ({
  data, keys, handleChange, titles, handleDelete
}) => {
  const [state, setState] = useState({
    targetKeys: [],
    selectedKeys: []
  });

  useEffect(() => {
    setState({ ...state, targetKeys: keys });
  }, [data, keys]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setState({ ...state, selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  const filterFromSelected = ({ key }) => {
    const filteredKeys = state.selectedKeys?.filter((item) => item !== key);
    setState({ ...state, selectedKeys: [...filteredKeys] });
  };
  const onDelete = (e, item) => {
    e.stopPropagation();
    filterFromSelected(item);
    handleDelete(item);
  };

  return (
    <Transfer
      showSelectAll
      dataSource={data}
      titles={titles}
      targetKeys={state.targetKeys}
      selectedKeys={state.selectedKeys}
      onChange={handleChange}
      rowKey={(record) => record.key}
      onSelectChange={handleSelectChange}
      render={(item) => (
        <Row justify="space-between" align="middle">
          <span>{item.title}</span>
          {!item.disabled && (
            <DeleteOutlined
              onClick={(e) => onDelete(e, item)} />
          )}
        </Row>
      )} />
  );
};

DataTransfer.defaultProps = {
  titles: [],
  handleDelete: noop
};

export default DataTransfer;
