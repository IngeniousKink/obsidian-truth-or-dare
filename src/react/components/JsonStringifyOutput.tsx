import React from 'react';

export const JsonStringifyOutput: React.FC<{ javascriptObject: object }> = ({ javascriptObject }) => {
  return <>
    <pre style={{ fontSize: "80%" }}>
      {JSON.stringify(javascriptObject, undefined, 2)}
    </pre>
  </>
}
