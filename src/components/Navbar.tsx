import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Link, NavLink } from "react-router-dom";

function Navbar({ isSticky }: any) {
  return (
    <div
      className={`shadow-sm border-b border-b-base-300 navbar ${
        isSticky ? "navbar-sticky" : "absolute"
      } z-50 bg-base-200 bg-opacity-40  
      backdrop-blur-lg `}
    >
      <div className="navbar container mx-auto flex-col-reverse gap-4 sm:flex-row">
        <div className="navbar-center sm:navbar-start">
          <div className="tabs tabs-boxed w-max bg-base-300 bg-opacity-50 border border-base-300">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "tab tab-active font-semibold" : "tab"
              }
            >
              Merkel Info
            </NavLink>
            <NavLink
              to="/claim"
              className={({ isActive }) =>
                isActive ? "tab tab-active font-semibold" : "tab"
              }
            >
              Claim
            </NavLink>
            <NavLink
              to="/records"
              className={({ isActive }) =>
                isActive ? "tab tab-active font-semibold" : "tab"
              }
            >
              Records
            </NavLink>
          </div>
        </div>
        <div className="navbar-center sm:navbar-end">
          <ConnectKitButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
