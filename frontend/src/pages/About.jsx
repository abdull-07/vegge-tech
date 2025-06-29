import React from 'react';

const About = () => {
  return (
    <section className="bg-background text-text px-4 py-12 md:py-20 max-w-6xl mx-auto">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">🌿 About Veggetech</h2>

      {/* Intro */}
      <p className="text-center text-text-light max-w-3xl mx-auto mb-10">
        At <strong className="text-primary">Veggetech</strong>, we bring you the freshest fruits and vegetables,
        handpicked directly from trusted farms. Our goal is to promote healthy eating, support local growers,
        and ensure quick doorstep delivery — all while maintaining sustainability and transparency.
      </p>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-primary">🥬 Our Mission</h3>
          <p className="text-sm text-text-light">
            To revolutionize the way fresh produce is delivered — ensuring high-quality, affordable, and chemical-free food for every household.
          </p>
        </div>
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-primary">🚚 Fast & Safe Delivery</h3>
          <p className="text-sm text-text-light">
            We’ve built a robust logistics system that ensures your orders are delivered fresh and fast, within hours.
          </p>
        </div>
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-primary">🧑‍🌾 Empowering Farmers</h3>
          <p className="text-sm text-text-light">
            We partner with local farmers to cut out middlemen, giving them fair prices and helping them grow sustainably.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">💡 Why Choose Veggetech?</h3>
        <ul className="list-disc list-inside text-sm text-text-light max-w-2xl mx-auto space-y-2">
          <li>✅ 100% Fresh & Organic Produce</li>
          <li>✅ Direct Farm-to-Home Sourcing</li>
          <li>✅ Transparent Pricing – No Hidden Charges</li>
          <li>✅ Secure Online Payments & Cash on Delivery</li>
          <li>✅ Customer Support Available 7 Days a Week</li>
        </ul>
      </div>

      {/* Trusted Statement */}
      <div className="bg-primary/10 p-6 rounded-lg text-center mb-12">
        <p className="text-primary text-lg font-medium">
          Trusted by 5,000+ happy customers across Pakistan. We deliver health, not just food.
        </p>
      </div>

      {/* Vision */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-secondary mb-2">🌍 Our Vision</h3>
        <p className="text-sm text-text-light max-w-xl mx-auto">
          To become Pakistan’s leading digital grocery brand — making healthy food affordable, accessible, and sustainable for every home.
        </p>
      </div>
    </section>
  );
};

export default About;