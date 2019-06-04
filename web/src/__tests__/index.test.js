import React from 'react';
import { render } from 'react-testing-library/typings';
import App from '../pages/index.js';

require('jest-dom/extend-expect');

jest.mock('next/link', () => {
  return ({ children }) => {
    return children;
  };
});

jest.mock('next/router', () => ({
  withRouter: component => {
    component.defaultProps = {
      ...component.defaultProps,
      router: { query: { id: 'testId1' } }
    };
    return component;
  }
}));

const session = {
  user: null
};

// skip this when the next.js development environment is running
describe.skip('index', () => {
  it('app shows navbar when navMenu is true', () => {
    const { getByPlaceholderText, container } = render(<App session={{ user: null }} navMenu={true} />);
    expect(getByPlaceholderText(/zoek naar nieuws, aandelen of een specifiek dossier/i)).toBeDefined();
    expect(container.firstChild).toHaveClass('navbar');
    expect(container.firstChild.classList.contains('navbar')).toBe(true);
  });
  it('app does not show navbar when navMenu is false', () => {
    const { container } = render(<App session={session} navMenu={false} />);
    expect(container.firstChild.classList.contains('navbar')).toBe(false);
  });
});
