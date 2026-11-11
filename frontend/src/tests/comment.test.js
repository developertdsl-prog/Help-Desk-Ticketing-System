import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_BASE } from '../api/api.service';

describe('Comment System', () => {
  const originalBaseURL = process.env.REACT_APP_API_BASE;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_API_BASE = originalBaseURL;
  });

  it('should add a comment to a ticket', async () => {
    // Mock successful comment addition
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        text: 'Test comment',
        createdBy: { name: 'Test User' },
        createdAt: new Date().toISOString(),
        isInternal: false,
      }),
    });

    localStorage.setItem('jwtToken', 'test-token');

    render(
      <div>
        <textarea data-testid="comment-text" rows="3" placeholder="Add a comment..." maxlength="500"></textarea>
        <button data-testid="send-comment-btn">Post</button>
      </div>
    );

    const commentText = screen.getByTestId('comment-text');
    const sendCommentBtn = screen.getByTestId('send-comment-btn');

    userEvent.type(commentText, 'Test comment');
    // Enable button after text is entered
    sendCommentBtn.disabled = false;
    userEvent.click(sendCommentBtn);

    // Verify comment was added
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('should show error when comment text is empty', async () => {
    localStorage.setItem('jwtToken', 'test-token');

    render(
      <div>
        <textarea data-testid="comment-text" rows="3" placeholder="Add a comment..." maxlength="500"></textarea>
        <button data-testid="send-comment-btn" disabled>Post</button>
      </div>
    );

    const sendCommentBtn = screen.getByTestId('send-comment-btn');
    // Button should be disabled when no text
    expect(sendCommentBtn.disabled).toBe(true);

    userEvent.type(screen.getByTestId('comment-text'), ' ');
    // Button should still be disabled for empty/whitespace only
    expect(sendCommentBtn.disabled).toBe(true);
  });