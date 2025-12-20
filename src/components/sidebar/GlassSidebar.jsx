import { useState } from "react";
import {
  FiHome,
  FiShield,
  FiGrid,
  FiCpu,
  FiBarChart2,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import UserProfileDock from "./UserProfileDock";
import Icon from "../common/Icon";

const GlassSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Control Center",
      path: "/dashboard",
      icon: FiHome,
      description: "Main dashboard feed",
    },
    {
      name: "Trending",
      path: "/trending",
      icon: FiTrendingUp,
      description: "Trending news",
    },
    {
      name: "Verify Hub",
      path: "/verify-hub",
      icon: FiShield,
      description: "Fact-checking engine",
    },
    {
      name: "IQ Lab",
      path: "/iq-lab",
      icon: FiCpu,
      description: "Gamified learning center",
    },
    {
      name: "Neural Analytics",
      path: "/neural-analytics",
      icon: FiBarChart2,
      description: "Data visualization",
    },
    {
      name: "Topic Matrix",
      path: "/topic-matrix",
      icon: FiGrid,
      description: "Coming Soon",
      locked: true,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 glassmorphism-radial border-r border-serenity-gray-lightest/50 shadow-soft ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-icon-brand-blue rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">✕</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gradient-serenity tracking-wide">
                  NEWS AI
                </h1>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-10 h-10 mx-auto bg-icon-brand-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">✕</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-serenity-royal/20 rounded-full flex items-center justify-center hover:bg-serenity-royal hover:text-white transition-all duration-300 shadow-md z-10 hover-serenity-glow"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <Icon
            icon={collapsed ? FiChevronRight : FiChevronLeft}
            size="sm"
            color="secondary"
            decorative
          />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* User Profile Dock */}
        <div className="border-t border-white/30">
          <UserProfileDock collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};

export default GlassSidebar;
