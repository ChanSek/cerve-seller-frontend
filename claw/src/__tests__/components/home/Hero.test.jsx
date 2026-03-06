import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../../../components/home/Hero';

const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);

describe('Hero', () => {
  it('renders the hero section', () => {
    renderHero();
    expect(screen.getByText(/AI-Powered/)).toBeInTheDocument();
  });

  it('renders the main headline', () => {
    renderHero();
    expect(screen.getByText('Your Phone,')).toBeInTheDocument();
  });

  it('renders the subtitle description', () => {
    renderHero();
    expect(screen.getByText(/Speak a command/)).toBeInTheDocument();
  });

  it('renders the Download for Android button', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /Download for Android/i })).toBeInTheDocument();
  });

  it('renders the See How It Works link', () => {
    renderHero();
    expect(screen.getByRole('link', { name: /See How It Works/i })).toHaveAttribute('href', '/how-it-works');
  });

  it('renders Open Source AI Phone Agent badge', () => {
    renderHero();
    expect(screen.getByText('Open Source AI Phone Agent')).toBeInTheDocument();
  });

  it('renders user-type agent steps', () => {
    renderHero();
    expect(screen.getByText('Order butter chicken from Zomato')).toBeInTheDocument();
    expect(screen.getByText('Yes, confirm')).toBeInTheDocument();
  });

  it('renders agent-type messages', () => {
    renderHero();
    expect(screen.getByText('Opening Zomato...')).toBeInTheDocument();
    expect(screen.getByText('Added to cart — ₹349')).toBeInTheDocument();
  });

  it('renders safety-type confirmation message', () => {
    renderHero();
    expect(screen.getByText(/Confirm payment of ₹349\?/)).toBeInTheDocument();
  });

  it('renders success-type message', () => {
    renderHero();
    expect(screen.getByText(/Order placed successfully!/)).toBeInTheDocument();
  });

  it('renders the phone UI elements', () => {
    renderHero();
    expect(screen.getByText('Claw Agent')).toBeInTheDocument();
    expect(screen.getByText('Say a command...')).toBeInTheDocument();
  });
});
