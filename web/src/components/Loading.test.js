import React from 'react';

import { render, cleanup } from 'react-testing-library';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import Loading from './Loading';

describe('Loading', () => {
  test('renders an empty div with classname "loader"', () => {
    const { container } = render(<Loading />);
    // assertions for dom nodes from jest-dom
    expect(container.firstChild).toHaveClass('columns');
    expect(container.firstChild).toHaveClass('is-mobile');
    //expect(container.firstChild.firstChild).toHaveAttribute('icon', 'spinner');
    //expect(container.firstChild.firstChild).toHaveAttribute('icon', 'spinner');
    //expect(container.firstChild.firstChild.).('icon', 'spinner');
  });
});
