import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  DownSquareOutlined,
  UpSquareOutlined,
  CheckOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';

export class CardToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      copyTooltipVisible: false
    };
  }

  handleCodeCopied = () => {
    this.setState({ copied: true });
  };

  onCopyTooltipVisibleChange = (visible) => {
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false
      });
      return;
    }
    this.setState({
      copyTooltipVisible: visible
    });
  };

  render() {
    const { code, expand, isExpand } = this.props;
    const { copied, copyTooltipVisible } = this.state;
    return (
      <div className="code-box-actions">
        <span
          className={`code-box-icon mr-3 ${copied && copyTooltipVisible ? 'text-success' : ''}`}>
          <Tooltip
            onOpenChange={this.onCopyTooltipVisibleChange}
            open={copyTooltipVisible}
            title={copied ? 'Copied' : 'Copy code'}>
            <CopyToClipboard onCopy={() => this.handleCodeCopied()} text={code}>
              {copied ? <CheckOutlined /> : <SnippetsOutlined />}
            </CopyToClipboard>
          </Tooltip>
        </span>
        <span className="code-box-icon" onClick={expand} role="presentation">
          <Tooltip title={isExpand ? 'Hide code' : 'Show code'}>
            {isExpand ? <UpSquareOutlined /> : <DownSquareOutlined />}
          </Tooltip>
        </span>
      </div>
    );
  }
}

export default CardToolbar;
