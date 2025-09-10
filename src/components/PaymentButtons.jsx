import React from 'react';

function PaymentButtons({ methods }) {
  return (
    <div className="field">
      <label>Pay Online</label>
      <div className="actions">
        {methods.map((method) => (
          <button key={method.id} type="button" className="pay-btn">
            {method.icon && (
              <img src={method.icon} alt={`${method.provider} icon`} className="payment-icon" />
            )}
            {method.provider}
          </button>
        ))}
      </div>
      <div className="hint">
        These buttons are dynamically updated from your WordPress admin panel.
      </div>
    </div>
  );
}

export default PaymentButtons;
