import React, { useState } from 'react';
import { CANCELATION_REASONS } from './order-cancelation-reason';

const CancelOrderModal = ( props ) => {
  const { showModal, handleCloseModal, data, onOrderCancel } = props;
  const [selectedReason, setSelectedReason] = useState('');

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleCancelOrder = () => {
    if (!selectedReason) {
      alert("Please select a cancellation reason.");
      return;
    }
    onCancel(selectedReason);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Cancel Order</h2>
        <div>
          <label htmlFor="cancel-reason">Select a reason for cancellation:</label>
          <select
            id="cancel-reason"
            value={selectedReason}
            onChange={handleReasonChange}
          >
            <option value="" disabled>Select reason</option>
            {CANCELATION_REASONS.map((reason) => (
              <option key={reason.id} value={reason.label}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button onClick={handleCancelOrder}>Cancel Order</button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
