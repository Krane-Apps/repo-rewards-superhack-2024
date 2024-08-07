import React from "react";

interface Stat {
  figureIcon: React.ReactNode;
  title: string;
  value: any;
  description: string;
  figureClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="stats shadow">
      {stats.map((stat, index) => (
        <div className="stat" key={index}>
          <div className={`stat-figure ${stat.figureClassName}`}>{stat.figureIcon}</div>
          <div className="stat-title">{stat.title}</div>
          <div className={`stat-value ${stat.valueClassName}`}>{stat.value}</div>
          <div className={`stat-desc ${stat.descriptionClassName}`}>{stat.description}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
