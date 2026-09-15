import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StarRating from "../../components/common/StarRating.jsx";

const ReviewsAdmin = () => {
  const { t } = useTranslation("admin");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api.get("/reviews").then((res) => setReviews(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const moderate = async (id, isApproved) => {
    try {
      await api.patch(`/reviews/${id}/moderate`, { isApproved });
      showToast(isApproved ? t("reviews.toastApproved") : t("reviews.toastHidden"), "success");
      load();
    } catch (err) {
      showToast(t("reviews.toastUpdateFailed"), "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("reviews.title")}</h1>
      {reviews.length === 0 ? <EmptyState title={t("reviews.empty")} /> : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold">{r.product?.title}</p>
                <StarRating rating={r.rating} size={14} />
                <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
                <p className="mt-1 text-xs text-gray-400">{t("reviews.by", { name: r.user?.name })} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => moderate(r._id, !r.isApproved)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${r.isApproved ? "border border-gray-200 hover:bg-gray-50" : "bg-emerald-600 text-white"}`}
              >
                {r.isApproved ? t("reviews.hide") : t("reviews.approve")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ReviewsAdmin;
