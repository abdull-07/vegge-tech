import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", form);
    alert("Thank you for contacting us!");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-background text-text px-4 py-12 md:py-20 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">📬 Contact Us</h2>
      <p className="text-center text-text-light mb-10">
        We'd love to hear from you! Fill out the form below and we'll get back to you soon.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200 space-y-6"
      >
        <div>
          <label htmlFor="name" className="block font-medium text-sm mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-medium text-sm mb-1">
            Message
          </label>
          <textarea
            name="message"
            required
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-primary/30 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message here..."
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover transition text-white font-medium px-6 py-2.5 rounded"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
