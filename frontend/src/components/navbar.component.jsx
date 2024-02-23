import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [ userNavPanel, setUserNavPanel ] = useState(false);

  const handleSearchButtonVisibility = () => {
    setSearchBoxVisibility((currentVal => !currentVal));
  };

  const handleUserNavPanel = () =>{
    setUserNavPanel((currentVal => !currentVal));
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 300)
  }

  const {userAuth, userAuth: {access_token, profile_img} } = useContext(UserContext);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <h1 className="text-2xl text-black font-bold">ODOP</h1>
        </Link>

        <div
          className={
            "absolute bg-white w-full right-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show " : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          />
          <i className="fi fi-rr-search absolute right-[10%]  md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={handleSearchButtonVisibility}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          {
            access_token ? 
            <>
            <Link to="/dashboard/notification">
              <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
              <i className="fi fi-rr-bell text-2xl block mt-1"></i>
              </button>
            </Link>

            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
              <button className="w-12 h-12 mt-1 rounded-full bg-grey relative hover:bg-black/10">
              <img src={profile_img} className="h-full w-full object-cover rounded-full"/>
              </button>

              {
              userNavPanel ? <UserNavigationPanel/> 
              : ""
              }
              
            </div>
            </>
            :
            <>
             <Link className="btn-dark py-2 " to="/signin">
            Sign In
          </Link>
          <Link className="btn-light py-2 hidden md:block" to="/signup">
            Sign Up
          </Link>
          </>

          }
        </div>
      </nav>
      <Outlet/>
    </>
  );
};

export default Navbar;
