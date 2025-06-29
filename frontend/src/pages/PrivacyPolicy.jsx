import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="bg-background text-text px-4 py-12 md:py-20 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary">Privacy Policy</h1>
      <p className="text-text-light text-sm text-center mb-10">
        Last updated: June 23, 2025
      </p>

      <div className="space-y-8 text-sm text-text-light leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-text mb-2">1. Introduction</h2>
          <p>
            At <strong>Veggetech</strong>, your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside">
            <li>Full Name, Email, and Phone Number</li>
            <li>Shipping & Billing Address</li>
            <li>Order history and product preferences</li>
            <li>Technical data (e.g. browser, IP, device)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">3. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc list-inside mt-1">
            <li>Fulfill and deliver your orders</li>
            <li>Provide customer support</li>
            <li>Send promotional offers (only with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">4. Sharing Your Data</h2>
          <p>
            We do not sell or trade your personal data. We may share it with trusted logistics partners or legal authorities when required.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">5. Cookies</h2>
          <p>
            We use cookies to enhance your shopping experience, remember your cart items, and analyze website traffic.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">6. Your Rights</h2>
          <p>
            You can request access, update, or deletion of your personal information anytime by contacting us at <span className="text-primary font-medium">support@veggetech.com</span>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">7. Changes to This Policy</h2>
          <p>
            We may update our privacy policy occasionally. All updates will be posted on this page with the revised date.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-2">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can reach out to us at: <br />
            📧 <strong>support@veggetech.com</strong> <br />
            📞 <strong>+92-123-4567890</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;