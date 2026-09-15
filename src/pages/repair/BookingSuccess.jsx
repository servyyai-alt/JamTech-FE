import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext.jsx";

const BookingSuccess = () => {
  const { bookingNumber } = useParams();
  const location = useLocation();
  const { t } = useTranslation("repair");
  const { showToast } = useToast();
  const booking = location.state?.booking;

  const copyNumber = () => {
    navigator.clipboard.writeText(bookingNumber);
    showToast(t("bookingNumberCopied"), "success");
  };

  return (
    <div className="container-px section-y mx-auto max-w-xl text-center">
      <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={64} />
      <h1 className="font-display text-3xl font-bold text-ink-900">{booking?.isManualQuote ? t("quoteReceived") : t("bookingConfirmed")}</h1>
      <p className="mt-2 text-gray-500">{booking?.isManualQuote ? t("quoteReviewMessage") : t("bookingReceivedMessage")}</p>

      <div className="card mx-auto mt-6 flex max-w-sm items-center justify-between p-4">
        <span className="font-mono text-lg font-bold text-primary-600">{bookingNumber}</span>
        <button onClick={copyNumber} className="rounded-lg p-2 hover:bg-gray-100"><Copy size={16} /></button>
      </div>

      {booking && (
        <div className="card mx-auto mt-6 max-w-sm space-y-2 p-6 text-left text-sm">
          <div className="flex justify-between"><span className="text-gray-500">{t("device")}</span><span className="font-medium">{booking.isManualQuote ? `${booking.customDevice?.brand} ${booking.customDevice?.model}` : `${booking.brand?.name} ${booking.deviceModel?.name}`}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t("repair")}</span><span className="font-medium">{booking.isManualQuote ? t("manualQuoteRequested") : booking.repairService?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t("serviceMethod")}</span><span className="font-medium">{booking.serviceMethod}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t("price")}</span><span className="font-medium">{booking.isManualQuote ? t("quotePending") : `€${booking.price}`}</span></div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/track-repair?bookingNumber=${bookingNumber}`} className="btn-primary">{t("trackThisRepair")}</Link>
        <Link to="/" className="btn-secondary">{t("backToHome")}</Link>
      </div>
    </div>
  );
};
export default BookingSuccess;
