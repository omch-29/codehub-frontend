import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../../Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestSearch, setSuggestSearch] = useState("");


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `https://codehub-backend-jj4b.onrender.com/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories || []);
        setSearchResults(data.repositories || []);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`https://codehub-backend-jj4b.onrender.com/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
        console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

        useEffect(() => {
  const fetchSearchResults = async () => {
    if (searchQuery.trim() === "") {
      // Show user's own repos by default
      setSearchResults(repositories);
      return;
    }

    try {
      const response = await fetch(
        `https://codehub-backend-jj4b.onrender.com/repo/search?name=${searchQuery}`
      );

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  fetchSearchResults();
}, [searchQuery]);


    // useEffect(() => {
    //         if (searchQuery == "") {
    //         setSearchResults(repositories);
    //         } else {
    //         const filteredRepo = repositories.filter((repo) =>
    //             repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //         setSearchResults(filteredRepo);
    //         }
    // }, [searchQuery, repositories]);
    const filteredSuggestions = suggestedRepositories.filter((r) =>
  r.name.toLowerCase().includes(suggestSearch.toLowerCase())
);

    return(
      <><Navbar/>
        <section id="dashboard">
            <aside className="sug">
                <h3>Suggested Repositories</h3>
                 <div className="sug-search">
                  <input
                    type="text"
                    placeholder="Search repositories"
                    value={suggestSearch}
                    onChange={(e) => setSuggestSearch(e.target.value)}
                  />
                </div>
          {filteredSuggestions.length === 0 ? (
          <p>No matching repositories.</p>
        ) : (
          filteredSuggestions.map((repo) => (
            <div key={repo._id} className="sugrepo">
              <Link to={`/init/${repo._id}`} className="repo-link">
                <h4>{repo.name}</h4>
              </Link>
            </div>
          ))
        )}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          {/* <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          {searchResults.map((repo) => {
            return (
              <div key={repo._id}>
                <Link to={`/init/${repo._id}`} className="repo-link">
                   <h5 className="repoName"><i className="fa-solid fa-laptop repoIcon"></i> {repo.name} </h5>
                </Link>
                {/* <h4>{repo.description}</h4> */}
              </div>
            );
          })}
        </main>
            <aside>
                <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
            </aside>
        </section>
        </>
    )
};


export default Dashboard;




async function name(params) {
  return true;
}