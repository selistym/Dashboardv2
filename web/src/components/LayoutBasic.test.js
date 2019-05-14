import React from 'react';

import { render, cleanup } from 'react-testing-library';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import LayoutBasic from './LayoutBasic';

describe('LayoutBasic', () => {
  test('renders a layout with a container', () => {
    const { container, debug } = render(<LayoutBasic children={<div />} />);
    // assertions for dom nodes from jest-dom
    expect(container.firstChild).toHaveClass('container');
  });
});
