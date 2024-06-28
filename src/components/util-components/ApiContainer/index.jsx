/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import syntaxTheme from './HLTheme';

function ApiContainer(props) {
  const { code } = props;
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch(code)
      .then((res) => res.text())
      .then((md) => {
        if (isMounted) {
          setMarkdown(md);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div className="api-container">
      {markdown && (
        <Markdown
          children={markdown}
          components={{
            h2: (h) => (
              <div
                className={`api-title h${h.level} ${
                  h.children[0].includes('title: ')
                    ? ''
                    : h.children[0].split('').join('').replace(/\s/g, '-').toLowerCase()
                }`}>
                {h.children[0].includes('title: ')
                  ? /title:(.+)/.exec(h.children[0])[1]
                  : h.children}
              </div>
            ),
            pre: (pre) => {
              const { params } = pre.children[0];
              const match = /language-(\w+)/.exec(params.className || '') || [];
              let language = '';

              if (match.length > 0) {
                // eslint-disable-next-line prefer-destructuring
                language = match[1];
              }

              return (
                <div className="api-code-highligher">
                  <SyntaxHighlighter language={language} style={syntaxTheme}>
                    {props.children}
                  </SyntaxHighlighter>
                </div>
              );
            }
          }}
          remarkPlugins={[remarkGfm]} />
      )}
    </div>
  );
}

export default ApiContainer;
