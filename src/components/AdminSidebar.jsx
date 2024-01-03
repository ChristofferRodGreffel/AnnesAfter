import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FIREBASE_AUTH } from "../../firebase-config";
import { signOut } from "firebase/auth";
import useWindowDimensions from "../helperfunctions/WindowWidth";
import { useEffect } from "react";

// Udviklet fælles i gruppen

const AdminSidebar = () => {
  const navigate = useNavigate();

  const storedSidebarOpen = localStorage.getItem("sidebarOpen");

  const [sidebarOpen, setSidebarOpen] = useState(storedSidebarOpen ? storedSidebarOpen === "true" : true);

  // useWindowDimensions is in helperfunctions
  const { width } = useWindowDimensions();

  useEffect(() => {
    // Sætter sidebaren til åben, hvis skærmen er større end 1034px
    if (width >= 1034) {
      // setSidebarOpen(true);
    }
  }, [width]);

  const handleUserLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        // Sign-out successful.
        navigate("/log-ind");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  const handleOpenCloseMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div
        id="adminMenu"
        className={`flex flex-col bg-mainGrey sticky left-0 top-0 z-[999] h-[100dvh] drop-shadow-lg ${
          sidebarOpen ? "min-w-[270px] w-[270px] transition-none" : "min-w-[80px] w-[80px]"
        } transition-all duration-200 ease-in-out`}
      >
        <NavLink to={"/ordre-oversigt"} className="m-auto mt-10 mb-16">
          <img className={`${sidebarOpen ? "w-48" : "w-14"}`} src={logo} alt="logo" />
        </NavLink>

        <div className="gap-2 absolute top-4 -right-3 cursor-pointer " onClick={handleOpenCloseMenu}>
          <i
            className={`fa-solid text-dark z-50 ${
              sidebarOpen ? "fa-circle-chevron-left" : "fa-circle-chevron-right"
            }  text-2xl hover:text-primary transition-all duration-200 ease-in-out`}
          ></i>
        </div>

        <nav className="flex justify-between flex-col h-full">
          <div className="relative flex flex-col">
            <div className="relative group">
              <NavLink
                to={"/ordre-oversigt"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap relative`
                }
              >
                <i className="fa-solid fa-house text-lg"></i>
                {sidebarOpen && "Ordre oversigt"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Ordre oversigt
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/ordre-historik"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-clock-rotate-left text-lg"></i>
                {sidebarOpen && "Tidl. ordre"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Tidl. ordre
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/statistik"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-chart-column text-lg"></i>
                {sidebarOpen && "Statistik"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Statistik
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/menu-oversigt"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-utensils text-lg"></i>
                {sidebarOpen && "Menu"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Menu
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/admin-guides"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-book-open text-lg"></i>
                {sidebarOpen && "Guide"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Guide
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/admin-indstillinger"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white hover:bg-gdarkhover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white  ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-sliders text-lg"></i>
                {sidebarOpen && "Indstillinger"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Indstillinger
                </div>
              )}
            </div>
            <div className="relative group">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive
                    ? `flex gap-3 items-center font-medium text-lg p-4 bg-primary text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                    : `flex gap-3 items-center font-medium text-lg p-4 transition-all duration-75 ease-in-out hover:bg-dark hover:text-white ${
                        sidebarOpen ? "pl-10" : "justify-center"
                      } whitespace-nowrap`
                }
              >
                <i className="fa-solid fa-users text-lg"></i>
                {sidebarOpen && "Kundevisning"}
              </NavLink>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Kundevisning
                </div>
              )}
            </div>
          </div>
          <div className="justify-self-end">
            <div className="relative group">
              <Link
                onClick={handleUserLogout}
                className={`flex gap-3 items-center font-medium text-lg p-4 mb-5 ${
                  sidebarOpen ? "pl-10" : "justify-center"
                } whitespace-nowrap`}
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
                {sidebarOpen && "Log ud"}
              </Link>

              {!sidebarOpen && (
                <div className="absolute bottom-[90%] left-[90%] bg-dark text-white rounded-r-2xl rounded-tl-2xl p-3 whitespace-nowrap opacity-0 transition-all duration-75 transform scale-0 origin-bottom-left group-hover:opacity-100 group-hover:scale-100">
                  Log ud
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
