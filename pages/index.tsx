import React from "react";
import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import {
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-hooks-web";
import { Hit } from "../components/Hit";
import { Autocomplete } from "../components/Autocomplete";
import { INSTANT_SEARCH_INDEX_NAME } from '../constants';

const Home = () => {
  const searchClient = algoliasearch(
    "PUKI00BKD5",
    "a9843dfda699d2c3388c1128b5c7c95b"
  );

  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        routing
      >
        <Autocomplete
          // @ts-ignore
          searchClient={searchClient}
          placeholder="Search articles"
          detachedMediaQuery="none"
          openOnFocus
        />
        <header className="header">
          <div className="header-wrapper wrapper">
            {/* <SearchBox /> */}
          </div>
        </header>
        <div className="container wrapper">
          <div>
            {/* <RefinementList attribute="brand" /> */}
          </div>
          <div>
            {/* <Hits hitComponent={Hit} /> */}
            {/* <Pagination /> */}
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export default Home;
