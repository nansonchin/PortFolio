import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";

const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:"about",
                element:<About/>
            },
            {
                path:"projects",
                element:<Projects/>,
            },
        ]
    },{
        path:"/project/:slug",
        element:<ProjectDetail/>
    }
])

export default router