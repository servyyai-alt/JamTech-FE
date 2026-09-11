import React, { useEffect, useRef, useState } from "react";
import * as paymentService from "../../services/paymentService.js";
import Loader from "../common/Loader.jsx";
import ErrorState from "../common/ErrorState.jsx";

// Mounts the Adyen Web Drop-in component using a session created securely on the backend.
// The backend NEVER exposes the Adyen API key — only the public client key is used here.
const AdyenDropIn = ({ referenceType, referenceId, onPaymentResult }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let dropinInstance;
    let cancelled = false;

    (async () => {
      try {
        const res = await paymentService.createPaymentSession(referenceType, referenceId);
        const { sessionData, sessionId, clientKey, merchantReference } = res.data;

        // Dynamically import so the bundle only loads Adyen Web when checkout is actually reached
        const AdyenCheckout = (await import("@adyen/adyen-web")).default;
        await import("@adyen/adyen-web/dist/adyen.css");

        if (cancelled) return;

        const checkout = await AdyenCheckout({
          environment: "test",
          clientKey,
          session: { id: sessionId, sessionData },
          onPaymentCompleted: (result) => onPaymentResult({ ...result, merchantReference }),
          onError: (err) => setError(err.message || "Payment error occurred."),
        });

        dropinInstance = checkout.create("dropin").mount(containerRef.current);
      } catch (err) {
        setError(err.response?.data?.message || "Could not initialize payment. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      dropinInstance?.unmount?.();
    };
    // eslint-disable-next-line
  }, [referenceId]);

  if (error) return <ErrorState message={error} />;

  return (
    <div>
      {loading && <Loader label="Loading secure payment form..." />}
      <div ref={containerRef} />
    </div>
  );
};
export default AdyenDropIn;
