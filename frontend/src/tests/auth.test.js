import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_BASE } from '../helpdesk-ui/src/api/api.service';

describe('Authentication Flow', () => {
  const originalBaseURL = process.env.REACT_APP_API_BASE;

  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_API_BASE = originalBaseURL;
  });

  it('should allow user to login with valid credentials', async () => {
    // Mock successful login response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-jwt-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'customer' },
      }),
    });

    // Render login form
    render(
      <div>
        <input id="email" data-testid="email-input" />
        <input id="password" data-testid="password-input" />
        <button data-testid="login-btn">Login</button>
      </div>
    );

    // Fill in the form and submit
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginBtn = screen.getByTestId('login-btn');

    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(loginBtn);

    // Verify token is stored and user is navigated
    expect(localStorage.getItem('jwtToken')).toBe('test-jwt-token');
  });

  it('should show error message on login failure', async () => {
    // Mock failed login response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(
      <div>
        <input data-testid="email-input" />
        <input data-testid="password-input" />
        <button data-testid="login-btn">Login</button>
      </div>
    );

    const emailInput = screen.getByLabelText('email');
    const passwordInput = screen.getByLabelText('password');
    const loginBtn = screen.getByLabelText('Login');

    userEvent.type(emailInput, 'wrong@example.com');
    userEvent.type(passwordInput, 'wrongpassword');
    userEvent.click(loginBtn);

    // Verify error message is displayed
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should allow user to register with valid data', async () => {
    // Mock successful register response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-jwt-register-token',
        user: { id: 2, name: 'New User', email: 'new@example.com', role: 'customer' },
      }),
    });

    render(
      <div>
        <input data-testid="name-input" placeholder="Name" />
        <input data-testid="email-input" placeholder="Email" />
        <input data-testid="password-input" placeholder="Password" />
        <button data-testid="register-btn">Register</button>
      </div>
    );

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const registerBtn = screen.getByTestId('register-btn');

    userEvent.type(nameInput, 'New User');
    userEvent.type(emailInput, 'new@example.com');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(registerBtn);

    // Verify token is stored
    expect(localStorage.getItem('jwtToken')).toBe('test-jwt-register-token');
  });
});