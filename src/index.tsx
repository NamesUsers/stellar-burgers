import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import { store } from './services/store';
import { ErrorBoundary } from 'react-error-boundary';

// создаём контейнер для всех порталов модалок один раз при старте
const ensureModalRoot = () => {
  const id = 'modal-root';
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
};
ensureModalRoot();

const container = document.getElementById('root')!;
const root = createRoot(container);

function fallbackRender({
  error,
  resetErrorBoundary
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

root.render(
  <ErrorBoundary
    fallbackRender={fallbackRender}
    onReset={() => {}}
    onError={() => {}}
  >
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>
);
