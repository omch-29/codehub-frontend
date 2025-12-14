
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./init.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import share from "../../assets/share.png";


axios.defaults.baseURL = "https://codehub-backend-jj4b.onrender.com"; // adjust if backend runs elsewhere

export default function InitPage() {
  const navigate = useNavigate();
  const { repoId } = useParams();
  const [repo, setRepo] = useState(null);
  const [cloneURL, setCloneURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folderPath, setFolderPath] = useState(null);
  
  const location = useLocation();
  const shareUrl = window.location.href;

  const pollRef = useRef(null);

  async function fetchRepoOnce() {
    try {
      const res = await axios.get(`/repo/id/${repoId}`);
      const data = res.data && res.data[0];
      if (!data) {
        setError("Repository not found");
        setRepo(null);
        setLoading(false);
        return;
      }
      setRepo(data);
      const owner = data.owner?.username || data.owner || "user";
      const repoName = data.name;
      const url = `https://codehub-backend-jj4b.onrender.com/${owner}/${repoName}.code?repoId=${repoId}`;
      // const url = `https://codehub-backend-jj4b.onrender.com/${owner}/${repoName}.code`;
      setCloneURL(url);
      setLoading(false);
    } catch (err) {
      console.error("Error loading repo:", err);
      setError("Error loading repository");
      setLoading(false);
    }
  }




  useEffect(() => {
  if (!repoId) return;

  fetchRepoOnce();

  const poll = setInterval(async () => {
    try {
      const res = await axios.get(`/repo/id/${repoId}`);
      const data = res.data && res.data[0];
      if (!data) return;

      setRepo(prev => {
        const prevLen = prev?.content?.length || 0;
        const newLen = data.content?.length || 0;

        if (prevLen !== newLen) return data;
        if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
        return prev;
      });
    } catch (err) {}
  }, 2000);

  return () => clearInterval(poll);  // ← FIX
}, [repoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!repo) return <div>Repository not found.</div>;

  // const files = Array.isArray(repo.content) ? repo.content : [];
  
const rawFiles = Array.isArray(repo.content) ? repo.content : [];

let files = rawFiles;

if (!folderPath) {
  files = rawFiles.filter(f => {
    const withoutRepo = f.path.split("/").slice(2).join("/"); 
    return !withoutRepo.includes("/"); 
  });
} else {
  
  files = rawFiles.filter(f => f.path.startsWith(folderPath));

  files = files.filter(f => {
    const inner = f.path.replace(folderPath, "").split("/");
    return inner[0] !== "" && inner.length === 1; 
  });
}

const token = localStorage.getItem("token");
let currentUserId = null;

if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    currentUserId = payload.id; 
  } catch {}
}
const isOwner =
  repo?.owner?._id === currentUserId || repo?.owner === currentUserId;


  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join my session",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  };




function buildTree(files) {
  const tree = {};

  files.forEach(f => {
    const parts = f.path.split("/"); // ["repo", commitId, ... folders ..., file]
    const inner = parts.slice(2);    // remove "repo", commitId
    let current = tree;

    inner.forEach((part, idx) => {
      const isLast = idx === inner.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          isFolder: !isLast,
          children: {}
        };
      }

      // attach file metadata on final node
      if (isLast) {
        current[part].file = f;
      }

      current = current[part].children;
    });
  });

  return tree;
}



  return (
    <div>
    <div className="init-container">
      <button className="dashred">
      
        <Link to="/">
          <p className="dashred">Dashboard</p>
          </Link>
          
      </button>
    <button onClick={handleShare} className="share-btn">
  <img 
    src= {share}
    width="22"
    alt="Share"
  />
</button>


      {isOwner && (
      <>
      <h2>Quick Setup — if you havent done this before</h2>


      {/* <button className="dashred">
      
        <Link to="/">
          <p className="dashred">Dashboard</p>
          </Link>
          
      </button> */}


      <div className="clone-box">
        {/* <p>Clone using HTTPS</p> */}
        <div className="clone-input">
          <input value={cloneURL} readOnly />
          <button onClick={() => navigator.clipboard.writeText(cloneURL)}>
            Copy
          </button>
        </div>
      </div>

      <pre className="instructions">
{`echo "# ${repo.name}" >> README.md
ghx init ${cloneURL}
ghx add <fileName> or ghx add .
ghx commit "first commit"
ghx push
`}
      </pre>

      <hr />
      </>
    )}
</div>
      <section className="pushed-files">
  <h3>Repository contents</h3>
      <button className="repodel"
  onClick={() => {

    const isOwner =
  repo?.owner?._id === currentUserId || repo?.owner === currentUserId;
    if (!isOwner) {
      alert("Only the repository owner can delete this repo.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this repository? This action cannot be undone."
    );

    if (!confirmed) return;

    fetch(`https://codehub-backend-jj4b.onrender.com/repo/delete/${repoId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  }
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Repository deleted successfully!");
        window.location.href = "/"; 
      })
      .catch((err) => {
        console.error("Delete Error:", err);
        alert("Failed to delete repository.");
      });
  }}

>
  Delete Repository
</button>



  {files.length === 0 ? (
    <p>No pushed files yet — push from your terminal using <code>ghx push</code>.</p>
  ) : (
    <table className="files-table">
      <thead>
        <tr>
          <th>File Name</th>
          {/* <th>Latest Commit Time</th> */}
        </tr>
      </thead>

      <tbody>
        {files.map((f) => (
          <tr 
            key={f._id || f.filename} 
            onClick={() => {
  if (f.isFolder) {
    const newPath = f.path + "/"; 
    setFolderPath(newPath);
    // const newPath = encodeURIComponent(f.path); // repo/<id>/folder/
    // navigate(`/repo/${repo._id}/tree?path=${newPath}`);
  } else {
    // Open file
    const key = f.path; // TRUE S3 KEY
    window.location.href =
      `https://codehub-backend-jj4b.onrender.com/repo/file/${repo._id}?path=${encodeURIComponent(key)}`;
  }
}}

//             onClick={() => {
//   const key = f.path;  // cleanPath only
// window.location.href =
//   `https://codehub-backend-jj4b.onrender.com/repo/file/${repo._id}?path=${encodeURIComponent(key)}`;

// }}

//             onClick={() => {
//   const key = f.fullS3Path || f.path;
//   window.location.href = `/file/${repo._id}?path=${encodeURIComponent(key)}`;
// }}
            // onClick={() => window.location.href = `/file/${repo._id}/${encodeURIComponent(f.fullS3Path)}`}

            // onClick={() => window.location.href = `/file/${repo._id}/${encodeURIComponent(f.path)}`}
            

            // onClick={() => window.location.href = `/file/${repo._id}/${f.path}`}
            className="file-row"
          >
          <td>
  {f.isFolder ? "📁 " + f.filename : "📄 " + f.filename}
</td>

            
            {/* <td>{new Date(repo.updatedAt).toLocaleString()}</td> */}
            <td>{repo.message}</td>
          </tr>
        ))}
      
  {/* {renderTree(tree, repo._id)} */}


      </tbody>
    </table>
  )}
</section>

    </div>
  );
}


// function buildTree(files) {
//   const tree = {};

//   files.forEach(file => {
//     const parts = file.path.split("/");
//     let current = tree;

//     // skip "commits", commitId
//     parts = parts.slice(2);

//     parts.forEach((part, index) => {
//       if (!current[part]) {
//         current[part] = {
//           name: part,
//           children: {},
//           isFolder: index !== parts.length - 1 || file.isFolder
//         };
//       }
//       current = current[part].children;
//     });
//   });

//   return tree;
// }

// function renderTree(tree, repoId) {
//   return Object.values(tree).map(node => (
//     <tr
//       key={node.name}
//       onClick={() => {
//         if (node.isFolder) return; // nothing for now
//         window.location.href = `/file/${repoId}/${encodeURIComponent(node.fullPath)}`;
//       }}
//     >
//       <td>{node.isFolder ? "📁 " : "📄 "}{node.name}</td>
//       <td></td>
//     </tr>
//   ));
// }

// const tree = buildTree(files);
