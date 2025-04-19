import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Filter out priority which causes a warning
    const { priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe('Home', () => {
  it('renders the Next.js logo', () => {
    render(<Home />);
    
    const logo = screen.getByAltText('Next.js logo');
    
    expect(logo).toBeInTheDocument();
  });
});