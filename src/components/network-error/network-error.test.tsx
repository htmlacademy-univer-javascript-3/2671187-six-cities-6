import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NetworkError from './network-error';

describe('NetworkError', () => {
  it('renders an error message and calls handler when retry clicked', () => {
    const handleClick = vi.fn();

    render(
      <NetworkError
        handleClick={handleClick}
        loadables='offers'
        error='Timeout'
      />
    );

    expect(
      screen.getByText('Error loading offers: Timeout')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(handleClick).toHaveBeenCalled();
  });
});
