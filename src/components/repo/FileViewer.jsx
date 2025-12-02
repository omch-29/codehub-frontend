import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FileViewer() {
  const { state } = useLocation();
  const file = state?.file;

  const [content, setContent] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const response = await axios.get(
      `https://codehub-backend-jj4b.onrender.com/repo/file?bucket=your-s3-bucket-name&key=${file.path}`
    );

    setContent(response.data);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>{file.filename}</h2>
      <pre
        style={{
          background: "#111",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap"
        }}
      >
        {content}
      </pre>
    </div>
  );
}
