import { render, screen } from '@testing-library/react';
import Actions from '../../../components/home/Actions';
import { currentActions, comingSoonActions } from '../../../constants/actions';

describe('Actions', () => {
  it('renders the section heading', () => {
    render(<Actions />);
    expect(screen.getByText('What Claw Can Do')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Actions />);
    expect(screen.getByText(/A growing set of actions/)).toBeInTheDocument();
  });

  it('renders the Available Now section', () => {
    render(<Actions />);
    expect(screen.getByText('Available Now')).toBeInTheDocument();
  });

  it('renders the Coming Soon section', () => {
    render(<Actions />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders all current action names', () => {
    render(<Actions />);
    currentActions.forEach((action) => {
      expect(screen.getByText(action.name)).toBeInTheDocument();
    });
  });

  it('renders all current action descriptions', () => {
    render(<Actions />);
    currentActions.forEach((action) => {
      expect(screen.getByText(action.description)).toBeInTheDocument();
    });
  });

  it('renders all coming-soon action names', () => {
    render(<Actions />);
    comingSoonActions.forEach((action) => {
      expect(screen.getByText(action.name)).toBeInTheDocument();
    });
  });

  it('renders all coming-soon action descriptions', () => {
    render(<Actions />);
    comingSoonActions.forEach((action) => {
      expect(screen.getByText(action.description)).toBeInTheDocument();
    });
  });
});
