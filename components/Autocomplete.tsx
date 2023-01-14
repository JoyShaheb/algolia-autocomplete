import React from "react";
import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import algoliasearch from "algoliasearch/lite";
import { render } from "react-dom";
import type { SearchClient } from "algoliasearch/lite";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { usePagination, useSearchBox } from "react-instantsearch-hooks";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { BaseItem } from "@algolia/autocomplete-core";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import "@algolia/autocomplete-theme-classic";
import { INSTANT_SEARCH_QUERY_SUGGESTIONS } from "../constants";

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
  searchClient: SearchClient;
  className?: string;
};

type SetInstantSearchUiStateOptions = {
  query: string;
};

export function Autocomplete({
  className,
  ...autocompleteProps
}: AutocompleteProps) {
  const autocompleteContainer = useRef<HTMLDivElement>(null);

  const searchClient = algoliasearch(
    "PUKI00BKD5",
    "4c650e522ef777b50c2299b40797700c"
  );

  const { query, refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();

  const [instantSearchUiState, setInstantSearchUiState] =
    useState<SetInstantSearchUiStateOptions>({ query });

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
  }, [instantSearchUiState]);

  const plugins = useMemo(() => {
    const recentSearches = createLocalStorageRecentSearchesPlugin({
      key: "instantsearch",
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setInstantSearchUiState({ query: item.label });
          },
        };
      },
    });

    const querySuggestions = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        return recentSearches.data!.getAlgoliaSearchParams({
          hitsPerPage: 6,
        });
      },
      // transformSource({ source }) {
      //   return {
      //     ...source,
      //     sourceId: "querySuggestionsPlugin",
      //     onSelect({ item }) {
      //       setInstantSearchUiState({ query: item.query });
      //     },
      //     getItems(params) {
      //       if (!params.state.query) {
      //         return [];
      //       }
      //       return source.getItems(params);
      //     },
      //   };
      // }
    });

    return [recentSearches, querySuggestions];
  }, []);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      initialState: { query },
      onReset() {
        setInstantSearchUiState({ query: "" });
      },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          setInstantSearchUiState({
            query: state.query,
          });
        }
      },
      renderer: {
        createElement,
        Fragment,
        // @ts-ignore
        render,
      },
      plugins,
    });

    return () => autocompleteInstance.destroy();
  }, [plugins]);

  return <div className={className} ref={autocompleteContainer} />;
}
