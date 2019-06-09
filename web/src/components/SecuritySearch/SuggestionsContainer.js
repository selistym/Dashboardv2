import React from 'react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

import SecuritiesContainer from './SecuritiesContainer';

export const INSTRUMENT_SUGGESTIONS_QUERY = gql`
  query InstrumentSuggestions {
    instrumentSuggestions {
      id
      name
      sector
      countryCode
      marketSize
    }
  }
`;

const SuggestionsContainer = () => {
  return (
    <Query query={INSTRUMENT_SUGGESTIONS_QUERY}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage message="Error loading securities." />;
        if (loading) return <Loading />;

        if (data.instrumentSuggestions === undefined) {
          return <p>Undefined securities</p>;
        }

        return <SecuritiesContainer suggestions={data.instrumentSuggestions} />;
      }}
    </Query>
  );
};

SuggestionsContainer.propTypes = {};

export default SuggestionsContainer;
