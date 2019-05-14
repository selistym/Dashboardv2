import React from 'react';

import { render, cleanup } from 'react-testing-library';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import SecurityCard from './SecurityCard';

const security={
  id: 'theid',
  name: 'VEB',
  isIdea: false,
  t: 50,
  d: 50,
  b: 75,
  g: 75,
  v: 75
};

describe('SecurityCard', () => {
  test('renders a card with a column for a security', () => {
    const { container, debug, getByText } = render(<SecurityCard security={security} children={<div />} />);
    // assertions for dom nodes from jest-dom
    expect(container.firstChild).toHaveClass('column');
    expect(container.firstChild).toHaveClass('is-4');
    expect(container.firstChild.firstChild).toHaveClass('card');
    getByText(/veb/i);
    getByText(/50%/i);
    getByText(/view/i);
    getByText(/add to portfolio/i);
  });
});
