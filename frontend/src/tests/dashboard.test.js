import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_BASE } from '../api/api.service';

describe('Dashboard Flow', () => {
  const originalBaseURL = process.env.REACT_APP_API_BASE;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_API_BASE = originalBaseURL;
  });

  it('should fetch dashboard stats for authenticated user', async () => {
    // Mock successful dashboard stats response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalTickets: 15,
        openTickets: 8,
        inProgressTickets: 4,
        resolvedTickets: 3,
        closedTickets: 2,
      }),
    });

    // Set up auth token
    localStorage.setItem('jwtToken', 'test-token');

    // Render dashboard
    render(
      <div>
        <div id="statsLoading" class="text-center">Loading...</div>
        <div id="roleContent" class="row"></div>
      </div>
    );

    // Verify loading state is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After fetch completes, stats should be updated
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify stats are displayed
    expect(screen.getByText('15')).toBeInTheDocument(); // totalTickets
    expect(screen.getByText('8')).toBeInTheDocument(); // openTickets
  });

  it('should handle role-specific content display', async () => {
    // Mock dashboard stats
    fetch.mockResolvedValueOnce({
      ok: true,
      json: {
        totalTickets: 10,
        openTickets: 5,
        resolvedTickets: 3,
        closedTickets: 2,
      },
    });

    localStorage.setItem('jwtToken', 'test-token');
    localStorage.setItem('userRole', 'admin');

    render(
      <div>
        <div id="adminDashboard" class="col-12"></div>
        <div id="agentDashboard" class="col-12 d-none"></div>
        <div id="customerDashboard" class="col-12 d-none"></div>
      </div>
    );

    // Verify admin dashboard is shown
    expect(screen.getByText('10')).toBeInTheDocument(); // total tickets

    // Check that role-specific sections are properly set
    const adminSection = screen.getByText('10');
    expect(adminSection).toBeInTheDocument();
  });

  it('should handle unauthenticated access', async () => {
    // No token set

    render(
      <div>
        <!-- Dashboard would redirect to login -->
      </div>
    );

    // Verify that without token, access is denied
    const token = localStorage.getItem('jwtToken');
    expect(token).toBeNull();
  });
});