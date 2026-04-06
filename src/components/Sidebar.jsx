import React from 'react';
import { useLabStore, EXPERIMENTS } from '../store';

export default function Sidebar() {
  const { currentExp, setExperiment } = useLabStore();

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">🧪</div>
        <h1>IbtikarZ Lab</h1>
      </div>
      <p className="sidebar-subtitle">Select an experiment to begin.</p>

      <div className="experiment-list">
        {Object.values(EXPERIMENTS).map((exp) => {
          const isActive = currentExp.id === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => setExperiment(exp.id)}
              className={`exp-btn ${isActive ? 'active' : ''}`}
            >
              <div className="exp-btn-content">
                <div className="exp-name">{exp.name}</div>
                <div className="exp-meta">Req: {exp.reqTemp.min}°C - {exp.reqTemp.max}°C</div>
              </div>
              {isActive && <div className="active-indicator" />}
            </button>
          )
        })}
      </div>
    </div>
  );
}
