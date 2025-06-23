import { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaUsers, FaBuilding, FaUserTie } from "react-icons/fa";
import Link from "next/link";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Define menu items
  const menuItems = [
    {
      label: "Customers",
      icon: <FaUsers />,
      link: "/Finance/Customer/customers",
    },
    {
      label: "Vendor",
      icon: <FaBuilding />,
      link: "/Finance/Vendor/vendor",
    },
    {
      label: "Employee",
      icon: <FaUserTie />,
      link: "/Finance/Employees/employee",
    },
  ];

  const isActiveLink = (link) => {
    if (!link) return false;
    // You can add router logic here if needed
    return false;
  };

  const isActiveParent = (item) => {
    if (!item.hasSubmenu) return false;
    return item.subItems.some((subItem) =>
      router.pathname.startsWith(subItem.link)
    );
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-md transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Collapse/Expand Button - Moved to top left */}
      <div className="absolute -right-4 top-3 z-50">
        <button
          onClick={toggleSidebar}
          className={`
            flex items-center justify-center w-8 h-8 
            rounded-full bg-white text-gray-600
            hover:text-blue-600 shadow-md 
            transition-all duration-300
            border border-gray-200
          `}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaAngleRight className="w-5 h-5" />
          ) : (
            <FaAngleLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 pt-4">
        <ul className="space-y-2">
          {menuItems.length === 0 && (
            <li className="px-4 py-3 text-gray-400 text-sm">
              No modules yet. Add your new module links here.
            </li>
          )}
          {menuItems.map((item, index) => {
            const isActive = isActiveLink(item.link);
            const isParentActive = isActiveParent(item);
            const isExpanded = item.menuKey
              ? expandedMenus[item.menuKey]
              : false;

            return (
              <li key={index} className="relative">
                {item.hasSubmenu ? (
                  <div>
                    <div
                      onClick={() => toggleMenu(item.menuKey)}
                      className={`group flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
                        isCollapsed ? "justify-center" : "gap-4"
                      } ${
                        isParentActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-xl ${
                          isParentActive
                            ? "text-blue-600"
                            : "group-hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="text-lg flex-1">
                            {item.label}
                          </span>
                          <span className="transform transition-transform duration-200">
                            {isExpanded ? (
                              <FaAngleLeft className="w-4 h-4" />
                            ) : (
                              <FaAngleRight className="w-4 h-4" />
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Submenu items */}
                    {isExpanded && (
                      <div
                        className={`
                          ${isCollapsed ? "pl-0" : "pl-4"} 
                          mt-1 
                          transition-all duration-200 
                          overflow-hidden
                        `}
                      >
                        {item.subItems.map((subItem, subIndex) => {
                          const isSubActive = isActiveLink(subItem.link);

                          return (
                            <Link
                              key={subIndex}
                              href={subItem.link}
                              prefetch={true}
                              className={`
                                flex items-center px-4 py-2 
                                transition-all duration-200 
                                ${isCollapsed ? "justify-center" : "gap-3"}
                                ${
                                  isSubActive
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }
                              `}
                            >
                              <span
                                className={`text-lg ${
                                  isSubActive ? "text-blue-600" : ""
                                }`}
                              >
                                {subItem.icon}
                              </span>
                              {!isCollapsed && (
                                <span className="text-sm">
                                  {subItem.label}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.link}
                    prefetch={true}
                    className={`
                      group flex items-center px-4 py-3 
                      transition-all duration-200 
                      ${isCollapsed ? "justify-center" : "gap-4"}
                      ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }
                    `}
                    aria-label={item.label}
                  >
                    <span
                      className={`text-xl ${
                        isActive
                          ? "text-blue-600"
                          : "group-hover:text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-lg">{item.label}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;