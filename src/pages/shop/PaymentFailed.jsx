import React from "react";
import { Link, useLocation } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const { state } = useLocation();
  return (
    <div className="container-px section-y mx-auto max-w-lg text-center">
      <XCircle className="mx-auto mb-4 text-red-500" size={64} />
      <h1 className="font-display text-3xl font-bold text-ink-900">Payment Failed</h1>
      <p className="mt-2 text-gray-500">
        We couldn't process payment for order {state?.orderNumber && <span className="font-mono font-semibold">{state.orderNumber}</span>}. No charge was made.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/checkout" className="btn-primary">Try Again</Link>
        <Link to="/contact" className="btn-secondary">Contact Support</Link>
      </div>
    </div>
  );
};
export default PaymentFailed;
