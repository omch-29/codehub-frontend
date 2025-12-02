import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FilesPage() {
  const { repoId } = useParams();
  const [repo, setRepo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRepo();
  }, []);

  async function loadRepo() {
    const res = await axios.get(`https://codehub-backend-jj4b.onrender.com/repo/id/${repoId}`);
    setRepo(res.data[0]);
  }

  if (!repo) return <div>Loading...</div>;

  return (
    <div style={{ margin: "40px" }}>
      <h2>{repo.name} — Files</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Last Commit Time</th>
          </tr>
        </thead>
        <tbody>
          {repo.content.map((file) => (
            <tr
              key={file._id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/file-viewer/${repoId}`, {
                  state: { file }
                })
              }
            >
              <td>{file.filename}</td>
              <td>{new Date(repo.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
