import React from 'react';
import { useLabStore, EXPERIMENTS } from '../store';
import { X, FlaskConical, Beaker, Thermometer, Droplets } from 'lucide-react';

const EXP_ICONS = {
  neutralization: Droplets,
  precipitation: FlaskConical,
  exothermic: Beaker,
  indicator: Thermometer,
};

export default function Sidebar({ isOpen, onClose }) {
  const { currentExp, setExperiment } = useLabStore();

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <div className="logo-icon">🧪</div>
            <h1>IbtikarZ Lab</h1>
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <p className="sidebar-subtitle">Select an experiment to begin.</p>

        <div className="experiment-list">
          {Object.values(EXPERIMENTS).map((exp) => {
            const isActive = currentExp.id === exp.id;
            const Icon = EXP_ICONS[exp.id] || FlaskConical;
            return (
              <button
                key={exp.id}
                onClick={() => {
                  setExperiment(exp.id);
                  onClose();
                }}
                className={`exp-btn ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} color={isActive ? "var(--accent-primary)" : "var(--text-secondary)"} />
                  <div className="exp-btn-content" style={{ textAlign: 'left' }}>
                    <div className="exp-name">{exp.name}</div>
                    <div className="exp-meta">Req: {exp.reqTemp.min}°C - {exp.reqTemp.max}°C</div>
                  </div>
                </div>
                {isActive && <div className="active-indicator" />}
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
}
