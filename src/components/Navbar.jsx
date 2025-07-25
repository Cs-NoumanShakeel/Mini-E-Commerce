import { ACCESS_TOKEN } from "../constants";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
    const handlecart = () => {
        if (localStorage.getItem(ACCESS_TOKEN) === null){
            alert('You will have to sign-in first')
        }
    }
    return (
      
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to = '/'>Mini E-Commerce</Link>
            </div>

            <div className="navbar-links">
                <Link to = '/products' className="navbar-link">Home</Link>
                <Link to = '/cart' className="navbar-link" onClick={handlecart}>View Cart</Link>
                 <Link to = '/admins' className="navbar-link">ADMIN</Link>
                <Link to = '/login' className="navbar-link">Sign in</Link>
            </div>
        </nav>
      
    )
}






