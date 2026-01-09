import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../spinner/spinner';

describe('Spinner component', () => {
  it('should render the spinner container', () => {
    const { container } = render(<Spinner />);

    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    });
  });

  it('should render the spinning animation element', () => {
    const { container } = render(<Spinner />);

    const spinnerElement = container.querySelector(
      'div[style*="border-radius: 50%"]'
    );
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveStyle({
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #007bff',
      borderRadius: '50%',
    });
  });

  it('should include the keyframes animation in the style tag', () => {
    const { container } = render(<Spinner />);

    const styleElement = container.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).toContain('@keyframes spin');
    expect(styleElement?.textContent).toContain('transform: rotate(0deg)');
    expect(styleElement?.textContent).toContain('transform: rotate(360deg)');
  });

  it('should have correct DOM structure', () => {
    const { container } = render(<Spinner />);

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.tagName).toBe('DIV');
    
    const innerDiv = outerDiv.querySelector('div');
    expect(innerDiv).toBeInTheDocument();
    
    const styleTag = outerDiv.querySelector('style');
    expect(styleTag).toBeInTheDocument();
  });
});

