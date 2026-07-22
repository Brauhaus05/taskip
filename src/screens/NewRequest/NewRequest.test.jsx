import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../../store/store.jsx';
import NewRequest from './index.jsx';
import Maintenance from '../Maintenance.jsx';
import RequestDone from '../RequestDone.jsx';

function renderWizard() {
  return render(
    <MemoryRouter initialEntries={['/requests/new']}>
      <StoreProvider>
        <Routes>
          <Route path="/requests/new" element={<NewRequest />} />
          <Route path="/requests/done" element={<RequestDone />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe('NewRequest wizard', () => {
  it('creates a request that appears in the maintenance list', async () => {
    const user = userEvent.setup();
    renderWizard();
    await user.click(screen.getByText('Plumbing'));               // step 1
    await user.type(screen.getByPlaceholderText(/Leaking faucet/i), 'Clogged drain');
    await user.click(screen.getByRole('button', { name: 'Continue' })); // -> step 3
    await user.click(screen.getByRole('button', { name: 'Submit request' }));
    expect(screen.getByText('Request submitted')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'View my requests' }));
    expect(screen.getByText('Clogged drain')).toBeInTheDocument();
  });
});
