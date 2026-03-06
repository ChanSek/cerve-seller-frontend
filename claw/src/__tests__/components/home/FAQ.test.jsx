import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '../../../components/home/FAQ';
import { faqItems } from '../../../constants/faq';

describe('FAQ', () => {
  it('renders the section heading', () => {
    render(<FAQ />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<FAQ />);
    expect(screen.getByText('Everything you need to know about Claw.')).toBeInTheDocument();
  });

  it('renders limited items when limit prop is provided (default 6)', () => {
    render(<FAQ />);
    const questions = faqItems.slice(0, 6);
    questions.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
    // Items beyond the limit should not be present
    if (faqItems.length > 6) {
      expect(screen.queryByText(faqItems[6].question)).not.toBeInTheDocument();
    }
  });

  it('renders all items when limit=null', () => {
    render(<FAQ limit={null} />);
    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('answers are not visible by default', () => {
    render(<FAQ />);
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();
  });

  it('shows answer when a question is clicked', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.getByText(faqItems[0].answer)).toBeInTheDocument();
  });

  it('applies open styling to question when clicked', () => {
    render(<FAQ />);
    const questionBtn = screen.getByText(faqItems[0].question);
    fireEvent.click(questionBtn);
    expect(questionBtn).toHaveClass('text-white');
  });

  it('hides answer when same question is clicked again (toggle)', () => {
    render(<FAQ />);
    const questionBtn = screen.getByText(faqItems[0].question);
    fireEvent.click(questionBtn);
    expect(screen.getByText(faqItems[0].answer)).toBeInTheDocument();
    fireEvent.click(questionBtn);
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();
  });

  it('closes previous answer when a different question is clicked', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.getByText(faqItems[0].answer)).toBeInTheDocument();

    fireEvent.click(screen.getByText(faqItems[1].question));
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();
    expect(screen.getByText(faqItems[1].answer)).toBeInTheDocument();
  });

  it('renders custom limit of 3', () => {
    render(<FAQ limit={3} />);
    for (let i = 0; i < 3; i++) {
      expect(screen.getByText(faqItems[i].question)).toBeInTheDocument();
    }
    expect(screen.queryByText(faqItems[3].question)).not.toBeInTheDocument();
  });
});
