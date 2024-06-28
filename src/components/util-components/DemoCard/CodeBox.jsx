import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import syntaxTheme from './HLTheme';
import CardToolBar from './CardToolbar';

export class CodeBox extends PureComponent {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    language: PropTypes.string
  };

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    language: null
  };

  constructor(props) {
    super(props);
    this.state = {
      codeExpand: false
    };
  }

  exapandCallBack = () => {
    // this.setState({ codeExpand: !this.state.codeExpand });
    this.setState((previousState) => ({
      codeExpand: !previousState.codeExpand
    }));
  };

  render() {
    const { language, children } = this.props;
    return (
      <>
        <CardToolBar
          code={children}
          expand={this.exapandCallBack}
          isExpand={this.state.codeExpand} />
        <div className={`code-box-highlight ${this.state.codeExpand ? 'd-block' : 'd-none'}`}>
          <SyntaxHighlighter language={language} style={syntaxTheme}>
            {children}
          </SyntaxHighlighter>
        </div>
      </>
    );
  }
}

export default CodeBox;
