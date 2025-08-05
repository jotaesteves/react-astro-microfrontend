const sidebarItems = [
  { icon: "🏠", label: "Início", href: "#" },
  { icon: "📁", label: "Registos", href: "#" },
  { icon: "📞", label: "Outbounds", href: "#" },
  { icon: "🛍️", label: "Vendas", href: "#" },
  { icon: "📃", label: "Scripts", href: "#" },
  { icon: "📔", label: "Documentação", href: "#" },
  { icon: "📊", label: "KPI's", href: "#" },
];

const bottomSidebarItems = [
  { icon: "⚙️", label: "Definições", href: "#" },
  { icon: "🔍", label: "Pesquisa", href: "#" },
];

function SideBarNavItem({
  icon,
  label,
  href,
  expanded,
}: {
  icon: string;
  label: string;
  href: string;
  expanded: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center text-gray-700 hover:text-blue-500 transition-all duration-300 relative w-full`}
      style={{ minWidth: "3rem" }}
    >
      <span className="icon text-xl w-8 flex-shrink-0 flex items-center justify-center">{icon}</span>
      <span
        className={`ml-2 transition-all duration-300 ${
          expanded ? "opacity-100 translate-x-0 w-32" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
        }`}
        style={{ pointerEvents: expanded ? "auto" : "none" }}
      >
        {label}
      </span>
    </a>
  );
}

import React, { useState } from "react";

export default function SideBarNav() {
  const [expanded, setExpanded] = useState(false);
  return (
    <nav
      className={`flex flex-col items-start p-4 space-y-2 bg-white h-full transition-all duration-300 ${
        expanded ? "w-56" : "w-24"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ minWidth: expanded ? "14rem" : "4rem" }}
    >
      {sidebarItems.map((item) => (
        <SideBarNavItem key={item.label} {...item} expanded={expanded} />
      ))}
      <div className="mt-auto flex flex-col items-start space-y-2">
        {bottomSidebarItems.map((item) => (
          <SideBarNavItem key={item.label} {...item} expanded={expanded} />
        ))}
      </div>
    </nav>
  );
}
