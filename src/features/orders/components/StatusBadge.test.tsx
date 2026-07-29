import { describe, expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { StatusBadge, PaymentBadge } from './StatusBadge';

describe('StatusBadge', () => {
  test('renders the order status label', () => {
    render(<StatusBadge status="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('renders each status without error', () => {
    const { rerender } = render(<StatusBadge status="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
    rerender(<StatusBadge status="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});

describe('PaymentBadge', () => {
  test('renders the payment status label', () => {
    render(<PaymentBadge status="Failed" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
