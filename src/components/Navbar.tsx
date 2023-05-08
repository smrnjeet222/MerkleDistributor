import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="container m-auto my-2 navbar bg-base-100 flex-col-reverse gap-4 sm:flex-row">
      <div className="navbar-center sm:navbar-start">
        <div className="tabs tabs-boxed w-max ">
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
  );
}

export default Navbar;
