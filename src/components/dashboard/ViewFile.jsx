import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewFile() {
  const { repoId, filePath } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const decodedPath = decodeURIComponent(filePath);
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `https://codehub-backend-jj4b.onrender.com/repo/file/${repoId}?path=${decodedPath}`,
  { withCredentials: true }
          // `https://codehub-backend-jj4b.onrender.com/repo/file/${repoId}?path=${filePath}`, {withCredentials: true}
        );
        setContent(res.data.content);
      } catch (e) {
        setContent("Error loading file.");
      }
      setLoading(false);
    }
    load();
  }, [repoId, filePath]);

  if (loading) return <div>Loading file...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Viewing File</h2>
      <pre 
        style={{
          background: "#fff",
          color: "#222",
          // padding: "15px",
          borderRadius: "10px",
          overflowX: "auto"
        }}
      >
        {content}
      </pre>
    </div>
  );
}
