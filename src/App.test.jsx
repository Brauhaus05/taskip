import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from './store/store.jsx';
import App from './App.jsx';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <StoreProvider><App /></StoreProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('renders the home greeting', () => {
    renderAt('/');
    expect(screen.getByText('Mara Ellison')).toBeInTheDocument();
  });
});
