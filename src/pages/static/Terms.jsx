import React from "react";

const Terms = () => {
  return (
    <div className="container-px section-y mx-auto max-w-4xl prose prose-sm sm:prose-base">
      <h1 className="mb-6 font-display text-3xl font-bold">Terms & Conditions</h1>
      <div className="text-gray-500 mb-8">
        {/* <p><strong>JAM Smart Tech Website:</strong> jam-tech-fe.vercel.app</p> */}
        <p><strong>Effective Date:</strong> 16 September 2026</p>
      </div>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the JAM Smart Tech website, submitting an enquiry, purchasing a product or service, or making a payment through the website, you agree to be bound by these Terms & Conditions. If you do not agree with these terms, you should not use the website or purchase our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. About Our Services</h2>
          <p>JAM Smart Tech provides technology-related products and services as described on the website, quotations, proposals, invoices, order confirmations, or other written communications issued to customers. Specific deliverables, timelines, pricing, and technical requirements may vary depending on the selected service or project.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
          <p>You agree to provide accurate, complete, and current information when placing an order, requesting a service, creating an account, or communicating with us. You are responsible for information, files, content, credentials, trademarks, images, and other materials supplied by you and must have the necessary rights or permissions to provide them.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Orders and Service Acceptance</h2>
          <p>Submitting an order, enquiry, or payment request does not automatically require JAM Smart Tech to accept the order. We may confirm, decline, modify, or cancel an order where there is an error in pricing, availability, information provided, technical feasibility, suspected fraud, or another legitimate business reason.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Pricing and Taxes</h2>
          <p>Prices displayed or quoted by JAM Smart Tech may be subject to applicable taxes, transaction charges, or other clearly identified fees. The applicable price will be the price communicated at the time of purchase or stated in the relevant quotation or invoice.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Payments and Stripe</h2>
          <p className="mb-2">Payments may be processed through Stripe or another authorized payment service provider. By making a payment, you authorize the applicable payment processor to process the transaction using the payment method you provide. Payment information is processed in accordance with the payment processor's applicable terms and privacy practices.</p>
          <p className="mb-2">JAM Smart Tech does not intentionally request or store complete card numbers or card security codes on its own systems unless specifically required and lawfully permitted.</p>
          <p>A successful payment does not by itself alter any separate service agreement, quotation, project scope, or delivery terms that apply to your purchase.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Invoices and Payment Confirmation</h2>
          <p>Where applicable, payment confirmation, invoices, receipts, or other transaction records may be provided electronically. Customers should retain these records for their own reference.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Delivery and Service Timelines</h2>
          <p>Delivery timelines depend on the product or service purchased and, for project-based work, on the agreed scope and the timely provision of required information, content, approvals, credentials, and feedback by the customer. Delays caused by incomplete information, delayed approvals, third-party services, or circumstances outside our reasonable control may affect delivery dates.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Services or Project Scope</h2>
          <p>For customized software, websites, or other project-based services, requests outside the agreed scope may require additional time and charges. Any material scope change may be confirmed through a revised quotation, written approval, or other agreed communication before the additional work is undertaken.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Intellectual Property</h2>
          <p>Unless otherwise agreed in writing, JAM Smart Tech retains ownership of its pre-existing software, frameworks, reusable components, templates, methodologies, tools, and other intellectual property. Customer-provided content remains the customer's responsibility. Ownership or usage rights for custom deliverables will be governed by the applicable quotation, agreement, or written terms between the parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Prohibited Use</h2>
          <p>You must not use the website or our services for unlawful activity, fraud, unauthorized access, infringement of intellectual property rights, distribution of malicious code, abuse of payment systems, or any activity that could damage the website, our systems, our service providers, or other users.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Third-Party Services</h2>
          <p>Our services may depend on third-party platforms, hosting providers, APIs, payment processors, domain providers, cloud services, or other external services. We are not responsible for outages, policy changes, security incidents, pricing changes, or other failures caused directly by third-party providers, although we will take reasonable steps to address service issues within our control.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Refunds, Returns and Cancellations</h2>
          <p>Refunds, returns, and cancellations are governed by our separate Refund / Return / Cancellation Policy. Where a refund is approved, the applicable payment processor may be used to return the funds to the original payment method, subject to the processor's processing timelines and applicable banking procedures.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Failed, Duplicate, or Unauthorized Payments</h2>
          <p>If you believe that a payment was duplicated, incorrectly charged, or made without authorization, you should contact JAM Smart Tech promptly with the relevant transaction details. We may investigate the transaction and coordinate with the payment processor where appropriate.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Account Security</h2>
          <p>If the website provides account functionality, you are responsible for maintaining the confidentiality of your login credentials and for activity carried out through your account. You should notify us promptly if you believe your account has been accessed without authorization.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Website Availability</h2>
          <p>We aim to keep the website available and accurate, but we do not guarantee that the website will always be uninterrupted, error-free, or available at all times. Maintenance, updates, technical failures, security incidents, or circumstances outside our reasonable control may temporarily affect availability.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">17. Disclaimer</h2>
          <p>To the extent permitted by applicable law, the website and its general informational content are provided on an 'as available' basis. Specific service commitments, warranties, or performance obligations will be determined by the applicable written agreement, quotation, or order terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">18. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, JAM Smart Tech will not be liable for indirect, incidental, special, consequential, or loss-of-profit damages arising from use of the website or services. Nothing in these Terms is intended to exclude or limit liability where such exclusion or limitation is prohibited by applicable law.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">19. Indemnity</h2>
          <p>To the extent permitted by applicable law, you agree to be responsible for claims, losses, or reasonable costs arising from your unlawful use of the website, your violation of these Terms, or your infringement of third-party rights through materials or information you provide to us.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">20. Termination or Suspension</h2>
          <p>We may suspend or terminate access to the website or a service where reasonably necessary because of unlawful activity, fraud, misuse, security concerns, non-payment, violation of these Terms, or other legitimate reasons. Termination does not remove obligations that by their nature should continue after termination.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">21. Privacy</h2>
          <p>Your use of the website is also subject to our Privacy Policy, which explains how personal information is collected, used, stored, and shared. The Privacy Policy forms part of the overall terms governing use of the website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">22. Changes to These Terms</h2>
          <p>JAM Smart Tech may update these Terms & Conditions from time to time. The updated version will be published on the website with a revised effective date. Continued use of the website after an update constitutes acceptance of the updated terms to the extent permitted by law.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">23. Governing Law and Dispute Resolution</h2>
          <p>These Terms shall be governed by the applicable laws of India, subject to mandatory consumer-protection and other applicable laws. Any dispute will first be addressed through good-faith communication between the parties. Where a dispute cannot be resolved amicably, the appropriate courts or dispute-resolution mechanism having jurisdiction under applicable law may be used.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">24. Contact Us</h2>
          <p>For questions regarding these Terms & Conditions, orders, payments, cancellations, or services, please contact JAM Smart Tech using the contact details provided on our website.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;