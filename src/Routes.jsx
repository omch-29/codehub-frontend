import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repo/createRepo";
import InitPage from "./components/user/init";
import Repository from "./components/repo/Repository";
import FilesPage from "./components/repo/FilesPage";
import FileViewer from "./components/repo/FileViewer";
import ViewFile from "./components/dashboard/ViewFile";
// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(
            !userIdFromStorage &&
             !["/auth", "/signup", "/repository"].includes(window.location.pathname) &&
        !window.location.pathname.includes("/file") || window.location.pathname.includes("/repo/file")
        )
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path: "/create",
            element: <CreateRepository />
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
        path:"/init/:repoId",
        element:<InitPage/>    
       },
        {
        path:"/file/:repoId/:filePath",
        element:<ViewFile/>    
       },
       {
        path: "/file-viewer/:repoId",
        element: <FileViewer />
        },
       {
        path:"/repository/:id",
        element:<Repository/>    
       },
       {
            path:"/files/:repoId",
            element:<FilesPage/>  
        },
        
        {
            path:"*",
            element:<Login/>
        },
        
    ]);
    
    return element;
}

export default ProjectRoutes;