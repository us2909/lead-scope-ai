import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PainCard from '../PainCard';

const mockProps = {
  title: 'Test Pain Point',
  blurb: 'This is a test pain point description',
  triggered_tiles: ['TEST-TILE-1'],
  triggering_keywords: ['test', 'keyword'],
  isSelected: false,
  onClick: jest.fn(),
};

describe('PainCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pain card with correct content', () => {
    render(<PainCard {...mockProps} />);
    
    expect(screen.getByText('Test Pain Point')).toBeInTheDocument();
    expect(screen.getByText('This is a test pain point description')).toBeInTheDocument();
  });

  it('applies correct styling when selected', () => {
    render(<PainCard {...mockProps} isSelected={true} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('bg-blue-600', 'border-blue-400');
  });

  it('applies correct styling when not selected', () => {
    render(<PainCard {...mockProps} isSelected={false} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('bg-gray-800', 'border-gray-700');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<PainCard {...mockProps} />);
    
    const card = screen.getByRole('button');
    await user.click(card);
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<PainCard {...mockProps} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<PainCard {...mockProps} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<PainCard {...mockProps} isSelected={true} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});