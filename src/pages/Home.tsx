import React from "react"
import Hero from "../components/Hero/Hero"
import FeaturedProjects from "../components/FeaturedProjects"

function Home(){
    return(
       <React.Fragment>
        <div>
            <Hero/>
            <FeaturedProjects/>
        </div>
       </React.Fragment>
    )
}

export default Home