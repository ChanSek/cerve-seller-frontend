import React, { useState } from 'react';
import { CANCELATION_REASONS } from './order-cancelation-reason';

const CancelOrderModal = (props) => {
  const { showModal, handleCloseModal, data, onOrderCancel } = props;
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      alert("Please select a cancellation reason.");
      return;
    }

    try {
      setLoading(true);
      await onOrderCancel(selectedReason); // assuming it's async
      setLoading(false);
      handleCloseModal(); // optional: close modal after success
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Failed to cancel order. Please try again.");
      setLoading(false);
    }
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
            disabled={loading}
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
          <button onClick={handleCloseModal} disabled={loading}>Close</button>
          <button onClick={handleCancelOrder} disabled={loading || !selectedReason}>
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>

        {loading && <div className="spinner">Loading...</div>} {/* Add a spinner here */}
      </div>
    </div>
  );
};

export default CancelOrderModal;
