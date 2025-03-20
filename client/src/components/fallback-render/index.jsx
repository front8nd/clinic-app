import React from 'react';

export default function FallBackRender({ error }) {
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
  </div>;
}
