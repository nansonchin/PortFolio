import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-widest">Logo</Link>
            <div className="hidden md:flex gap-8"> 
                <Link to="/">Home</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/about">Home</Link>

            </div>
        </nav>
    )
}

export default Navbar