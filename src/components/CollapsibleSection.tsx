import React from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  count,
  isExpanded,
  onToggle,
  children,
  className = ""
}) => {
  return (
    <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md ${className}`}>
      {/*header do colapsador*/}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} seção ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {count}
          </span>
        </div>
        
        <div 
          className={`transform transition-transform duration-300 text-gray-400 group-hover:text-blue-600 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="w-6 h-6" />
        </div>
      </button>
      
      {/* cont retrátil */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'max-h-[5000px] opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-6 pt-0 border-t border-gray-100">
          {children}
        </div>
      </div>
    </section>
  );
};