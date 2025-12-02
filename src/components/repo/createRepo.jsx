
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createRepo.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const owner = localStorage.getItem("userId");

    try {
      const res = await axios.post("https://codehub-backend-jj4b.onrender.com/repo/create", {
        owner,
        name,
        description,
        visibility,
        issues: [],
        content: []
      });

      setMessage(res.data.message);
      localStorage.setItem("repoId", res.data.repositoryID);
      console.log("repoId stored:", res.data.repositoryID);

      // Redirect after 1.2 seconds
      setTimeout(() => {
        navigate(`/init/${res.data.repositoryID}`);
      }, 1200);

    } catch (err) {
      console.error("Error:", err);
      setMessage(err.response?.data?.error || "Error creating repository");
    }
  };

  return (
    <div className="repo-container">
      <h2>Create a New Repository</h2>

      <form className="repo-form" onSubmit={handleSubmit}>
        <label>Repository Name *</label>
        <input
          type="text"
          placeholder="my-awesome-project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Describe your project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Visibility</label>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value === "true")}>
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>

        <button type="submit">Create Repository</button>
      </form>

      {message && <p className="repo-message">{message}</p>}
    </div>
  );
};

export default CreateRepository;
