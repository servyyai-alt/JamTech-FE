import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-px section-y mx-auto flex max-w-lg flex-col items-center text-center">
    <h1 className="font-display text-6xl font-extrabold text-primary-600">404</h1>
    <p className="mt-3 text-lg font-semibold text-ink-900">Page not found</p>
    <p className="mt-1 text-sm text-gray-500">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">Back to Home</Link>
  </div>
);
export default NotFound;
