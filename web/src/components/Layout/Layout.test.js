import React from 'react';

import { render, cleanup } from 'react-testing-library/typings';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import LayoutBasic from '../LayoutOld/LayoutBasic';

describe('LayoutBasic', () => {
  test('renders a layout with a container', () => {
    const { container } = render(<LayoutBasic><div/></LayoutBasic>);
    // assertions for dom nodes from jest-dom
    expect(container.firstChild).toHaveClass('container');
  });
});
