import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => ({
    user: { full_name: 'Test User', role: 'student' },
    logout: jest.fn(),
    hasRole: (...roles) => roles.includes('student'),
  }),
}));

jest.mock('../services/api', () => ({
  __esModule: true,
  notificationAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: { unreadCount: 2 } })),
  },
}));

beforeAll(() => {
  // Ant Design may call matchMedia; provide a minimal stub for jsdom.
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

test('MainLayout renders user name', async () => {
  // Require after mocks so MainLayout picks up mocked modules.
  const MainLayout = require('../components/MainLayout').default;

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<div>Child</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Test User')).toBeTruthy();
  expect(screen.getByText(/Quản lý Đào tạo/i)).toBeTruthy();

  // Verify it tries to load notifications (avoid asserting exact Badge DOM).
  const { notificationAPI } = require('../services/api');
  await waitFor(() => {
    expect(notificationAPI.getAll).toHaveBeenCalled();
  });
});

