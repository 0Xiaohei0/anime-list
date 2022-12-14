import React from "react";
import CoverImageCard from "./CoverImageCard";
import { useState, useEffect } from "react";

export default function CoverCardList({ search }) {
  const [mediaArray, setMediaArray] = useState([]);
  useEffect(() => {
    // Here we define our query as a multi-line string
    // Storing it in a separate .graphql/.gql file is also possible
    var query = `
    query ( $page: Int, $perPage: Int= 10, $search: String = "k-on", $isAdult: Boolean = false) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media ( search: $search, isAdult: $isAdult) {
          id
          type
          description
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          season
          seasonYear
          status
          episodes
          duration
          genres
          averageScore
          coverImage {
            extraLarge
          }
          title {
            romaji
          }
        }
      }
    }
`;

    // Define our query variables and values that will be used in the query request
    var variables = {
      search: search,
      perPage: 10,
      isAdult: false,
    };

    // Define the config we'll need for our Api request
    var url = "https://graphql.anilist.co",
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      };

    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(data) {
      console.log(data);
      setMediaArray(data.data.Page.media);
      console.log(mediaArray);
    }

    function handleError(error) {
      alert("Error, check console");
      console.error(error);
    }
    // Make the HTTP Api request
    fetch(url, options)
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <section className="CoverCardList--section">
      <h3> Search result: {search}</h3>
      <div className="CoverCardList--container">
        {mediaArray.map((Anime) => {
          return (
            <CoverImageCard
              key={Anime.id}
              id={Anime.id}
              imageUrl={Anime.coverImage.extraLarge}
              name={Anime.title.romaji}
              type={Anime.type}
              description={Anime.description}
              episodes={Anime.episodes}
            />
          );
        })}
      </div>
    </section>
  );
}
