import React from "react";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch-hooks-web";

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    image: string;
    brand: string;
    categories: string[];
  }>;
};

export const Hit = ({ hit }: any) => {
  return (
    <article className="hit">
      <div className="hit-image">
        {/* <img src={hit.image} alt={hit.name} /> */}
        <div className="">{hit.title}</div>
      </div>
      <div>
        <h1>
          <Highlight hit={hit} attribute="name" />
        </h1>
        <div>
          {/* By <strong>{hit.brand}</strong> in{" "} */}
          {/* <strong>{hit.categories[0]}</strong> */}
        </div>
      </div>
    </article>
  );
};
