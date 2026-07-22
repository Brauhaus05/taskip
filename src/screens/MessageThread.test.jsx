import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../store/store.jsx';
import MessageThread from './MessageThread.jsx';

function renderThread() {
  return render(
    <MemoryRouter initialEntries={['/messages/t-1']}>
      <StoreProvider>
        <Routes><Route path="/messages/:threadId" element={<MessageThread />} /></Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe('MessageThread', () => {
  it('shows the seeded message and appends a sent message', async () => {
    const user = userEvent.setup();
    renderThread();
    expect(screen.getByText(/plumber will come Tuesday/i)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/message/i), 'On my way');
    await user.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText('On my way')).toBeInTheDocument();
  });
});
