import React from 'react';

import { render, cleanup } from 'react-testing-library';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import Header from './Header';

describe('Loading', () => {
  test('renders a navbar', () => {
    const { container } = render(<Header />);
    // assertions for dom nodes from jest-dom
    expect(container.firstChild).toHaveClass('navbar');
  });
  test('renders a Home menu item', () => {
    const { getByText } = render(<Header />);
    getByText(/home/i);
    getByText(/over de veb/i);
  });
});
