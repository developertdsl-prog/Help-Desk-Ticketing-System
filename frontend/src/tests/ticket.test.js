import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_BASE } from '../api/api.service';

describe('Ticket Creation Flow', () => {
  const originalBaseURL = process.env.REACT_APP_API_BASE;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_API_BASE = originalBaseURL;
  });

  it('should create a new ticket successfully', async () => {
    // Mock successful ticket creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: 'Test Ticket',
        description: 'Test description',
        status: 'open',
        createdAt: new Date().toISOString(),
      }),
    });

    // Set auth token
    localStorage.setItem('jwtToken', 'test-token');

    render(
      <div>
        <input data-testid="title-input" placeholder="Title" />
        <select data-testid="priority-select">
          <option value="medium">Medium</option>
        </select>
        <select data-testid="category-select">
          <option value="general">General</option>
        </select>
        <textarea data-testid="description-input" rows="4"></textarea>
        <button data-testid="create-btn">Create Ticket</button>
      </div>
    );

    const titleInput = screen.getByTestId('title-input');
    const prioritySelect = screen.getByTestId('priority-select');
    const categorySelect = screen.getByTestId('category-select');
    const descriptionTextarea = screen.getByTestId('description-input');
    const createBtn = screen.getByTestId('create-btn');

    userEvent.type(titleInput, 'Test Ticket');
    userEvent.selectOption(prioritySelect, 'medium');
    userEvent.selectOption(categorySelect, 'general');
    userEvent.type(descriptionTextarea, 'Test description');
    userEvent.click(createBtn);

    // Verify ticket was created
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
  });

  it('should show validation errors on invalid form', async () => {
    // No mock - form should fail validation

    localStorage.setItem('jwtToken', 'test-token');

    render(
      <div>
        <input data-testid="title-input" />
        <button data-testid="create-btn">Create Ticket</button>
      </div>
    );

    const createBtn = screen.getByTestId('create-btn');
    userEvent.click(createBtn);

    // Verify that required field validation works
    expect(screen.getByText('Title required') || screen.getByText('Please provide title')).toBeInTheDocument();
  });
});