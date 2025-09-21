// src/components/PaymentMethods.jsx
import React, { useState } from "react";
import usePaymentMethods from "src/hooks/usePaymentMethods";

function PaymentMethods({ selectedMethod, onSelectMethod }) {
  const { methods, loading, error } = usePaymentMethods();
  const [selected, setSelected] = useState(selectedMethod);

  const handleSelect = (method) => {
    setSelected(method);
    onSelectMethod(method);
  };

  if (loading) {
    return (
      <div className="field">
        <label>Payment Method *</label>
        <div className="text-center p-4">Loading payment methods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="field">
        <label>Payment Method *</label>
        <div className="text-red-500 text-center p-4">
          Error loading payment methods. Please try again.
        </div>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="field">
        <label>Payment Method *</label>
        <div className="text-center p-4 text-yellow-500">
          No payment methods available. Please contact support.
        </div>
      </div>
    );
  }

  return (
    <div className="field">
      <label>Payment Method *</label>
      <div className="payment-methods-grid">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-option ${
              selected?.id === method.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(method)}
          >
            {method.icon && (
              <img
                src={method.icon}
                alt={method.provider}
                className="payment-method-icon"
              />
            )}
            <span className="payment-method-name">{method.provider}</span>
          </div>
        ))}
      </div>
      {!selected && (
        <p className="text-red-500 text-sm mt-1">
          Please select a payment method
        </p>
      )}
    </div>
  );
}

export default PaymentMethods;
