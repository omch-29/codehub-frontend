
import axios from "axios";
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://codehub-backend-jj4b.onrender.com";
export default function Repository() {
  const { id } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

// useEffect(() => {
//     localStorage.setItem("repoId", id);
//   }, [id]);
 
  useEffect(() => {
    async function fetchRepo() {
      try {
        const res = await axios.get(
          `https://codehub-backend-jj4b.onrender.com/repo/id/${id}`,
          { withCredentials: true }
        );

        const repo = res.data[0];

        if (repo?.content?.length > 0) {
          clearInterval(intervalRef.current);
          navigate(`/files/${repo._id}`);
        }
      } catch (err) {
        console.log("Error fetching repo", err);
      }
    }

    intervalRef.current = setInterval(fetchRepo, 1500);

    return () => clearInterval(intervalRef.current);
  }, [id, navigate]);

  return <></>;
}
