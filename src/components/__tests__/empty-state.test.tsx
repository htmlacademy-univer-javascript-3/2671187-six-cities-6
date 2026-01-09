import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from '../empty-state/empty-state';

describe('EmptyState component', () => {
  it('should display empty message', () => {
    render(<EmptyState cityName="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should display city name in message', () => {
    render(<EmptyState cityName="Amsterdam" />);

    expect(
      screen.getByText(
        'We could not find any property available at the moment in Amsterdam'
      )
    ).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<EmptyState cityName="Paris" />);

    expect(container.firstChild).toHaveClass('cities__no-places');
    expect(
      container.querySelector('.cities__status-wrapper')
    ).toBeInTheDocument();
    expect(container.querySelector('.tabs__content')).toBeInTheDocument();
    expect(container.querySelector('.cities__status')).toBeInTheDocument();
    expect(
      container.querySelector('.cities__status-description')
    ).toBeInTheDocument();
  });

  it('should display different cities correctly', () => {
    const { rerender } = render(<EmptyState cityName="Paris" />);
    expect(screen.getByText(/Paris/)).toBeInTheDocument();

    rerender(<EmptyState cityName="Cologne" />);
    expect(screen.getByText(/Cologne/)).toBeInTheDocument();

    rerender(<EmptyState cityName="Brussels" />);
    expect(screen.getByText(/Brussels/)).toBeInTheDocument();

    rerender(<EmptyState cityName="Hamburg" />);
    expect(screen.getByText(/Hamburg/)).toBeInTheDocument();

    rerender(<EmptyState cityName="Dusseldorf" />);
    expect(screen.getByText(/Dusseldorf/)).toBeInTheDocument();
  });

  it('should render correct structure', () => {
    const { container } = render(<EmptyState cityName="Paris" />);

    const section = container.querySelector('section.cities__no-places');
    expect(section).toBeInTheDocument();

    const statusWrapper = container.querySelector('.cities__status-wrapper');
    expect(statusWrapper).toBeInTheDocument();

    const status = container.querySelector('.cities__status');
    expect(status).toBeInTheDocument();
    expect(status?.textContent).toBe('No places to stay available');

    const description = container.querySelector('.cities__status-description');
    expect(description).toBeInTheDocument();
  });
});

