// src/pages/CustomerService.jsx
import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import customerService from "../assets/customerService.jpg";
import { Mail, MessageSquareMore, Phone } from "lucide-react";

const CustomerService = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: "",
  });

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by visiting the 'My Orders' page in your account. Click on any order to see its current status and tracking information.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Visit our Returns Center to initiate a return.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. Free shipping on orders over $50.",
    },
    {
      question: "How can I change or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. Visit 'My Orders' and select the order you wish to modify.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll respond within 24 hours.");
    setFormData({ name: "", email: "", orderNumber: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Customer Service"
        subtitle="We're here to help 24/7"
        icon={<MessageSquareMore size={90} />}
        bgImage={customerService}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 flex justify-center flex-col items-center text-center">
            <div className="text-4xl mb-3">
              <Phone size={48} />
            </div>
            <h3 className="font-bold text-lg mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-2">Mon-Fri, 9am-6pm</p>
            <a href="tel:+18001234567" className="text-blue-600 font-semibold">
              1-800-123-4567
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex justify-center flex-col items-center text-center">
            <div className="text-4xl mb-3">
              <Mail size={48} />
            </div>
            <h3 className="font-bold text-lg mb-2">Email Support</h3>
            <p className="text-gray-600 mb-2">24/7 Response</p>
            <a
              href="mailto:support@ecommerce.com"
              className="text-blue-600 font-semibold"
            >
              support@ecommerce.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex justify-center flex-col items-center text-center">
            <div className="text-4xl mb-3">
              <MessageSquareMore size={48} />
            </div>
            <h3 className="font-bold text-lg mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-2">Instant Support</p>
            <button className="text-blue-600 font-semibold hover:underline">
              Start Chat
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* FAQ Section */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow">
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                    className="w-full px-6 py-4 text-left flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activeFaq === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number (optional)
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Domestic Shipping</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Standard (5-7 days): $5.99</li>
                <li>• Express (2-3 days): $12.99</li>
                <li>• Free shipping on orders over $50</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">International Shipping</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Standard (10-14 days): $15.99</li>
                <li>• Express (5-7 days): $25.99</li>
                <li>• Tracking included with all shipments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
