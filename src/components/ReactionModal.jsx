import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../store';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReactionModal() {
  const { isMixed, resetLab, reactionState, currentExp, pouredFlaskId, temperature } = useLabStore();
  
  const isSuccess = reactionState === 'success';
  
  let errorMessage = '';
  let educationalReason = '';

  const pouredFlask = currentExp.availableFlasks.find(f => f.id === pouredFlaskId);
  const pouredReason = pouredFlask ? pouredFlask.reason : '';

  if (isSuccess) {
     educationalReason = pouredReason;
  } else {
    if (reactionState === 'failed_temp') {
      errorMessage = `${currentExp.errorMsgTemp} (Currently at ${temperature}°C, but requires ${currentExp.reqTemp.min}°C to ${currentExp.reqTemp.max}°C).`;
      educationalReason = "Temperature affects reaction rates and solubility! Adjust the burner before pouring the chemical.";
    } else if (reactionState === 'failed_chem') {
      const pouredName = pouredFlask ? pouredFlask.label : 'this chemical';
      errorMessage = `${currentExp.errorMsgChem} You added ${pouredName}.`;
      educationalReason = pouredReason;
    }
  }

  return (
    <AnimatePresence>
      {isMixed && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="reaction-modal glass-panel"
        >
          <div className={`status-badge ${isSuccess ? 'success' : 'error'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {isSuccess ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {isSuccess ? 'Reaction Success' : 'Reaction Failed'}
          </div>
          <h2>{currentExp.name}</h2>
          <p className="reaction-desc">
            {isSuccess ? currentExp.equation : errorMessage}
          </p>

          {educationalReason && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.05)', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              fontSize: '14.5px', 
              marginBottom: '24px', 
              fontStyle: 'normal', 
              color: '#334155',
              lineHeight: '1.4',
              textAlign: 'left',
              borderLeft: isSuccess ? '4px solid #16a34a' : '4px solid #dc2626'
            }}>
               <span style={{ fontWeight: 'bold' }}>Teacher's Note:</span> {educationalReason}
            </div>
          )}
          
          <div className="modal-actions">
            <button onClick={resetLab} className="primary-btn">
              Reset Experiment
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
