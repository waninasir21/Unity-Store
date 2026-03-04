// src/pages/GiftCards.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import { Gift } from "lucide-react";
import gifts from "../assets/gifts.jpg";

const GiftCards = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Gift Cards"
        subtitle="The perfect gift for any occasion"
        icon={<Gift size={48} />}
        bgImage={gifts}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Coming Soon Message */}
          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="text-8xl flex justify-center text-gray-800 mb-6 animate-bounce">
              <Gift size={100} />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Gift Cards Available Right Now
            </h2>

            <p className="text-gray-600 mb-8 text-lg">
              We're working on bringing you digital gift cards! Please check
              back soon or explore our products instead.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
              <div className="bg-purple-600 h-2.5 rounded-full w-3/4"></div>
            </div>

            <p className="text-sm text-gray-500 mb-8">Feature coming soon</p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Products
              </Link>

              <Link
                to="/best-sellers"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                View Best Sellers
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  When will gift cards be available?
                </h4>
                <p className="text-gray-600">
                  We're aiming to launch digital gift cards within the next few
                  weeks. Sign up above to get notified!
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Can I purchase a gift card for someone else?
                </h4>
                <p className="text-gray-600">
                  Once launched, you'll be able to purchase gift cards for
                  anyone and send them via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
