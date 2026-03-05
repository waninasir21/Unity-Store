import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-400">
              Your one-stop shop for all your needs. We offer quality products
              at competitive prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="text-gray-400 hover:text-white"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore More</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/13"
                  className="text-gray-400 hover:text-white"
                >
                  Party Decoration
                </Link>
              </li>
              <li>
                <Link
                  to="/category/45"
                  className="text-gray-400 hover:text-white"
                >
                  Beauty
                </Link>
              </li>
              <li>
                <Link
                  to="/category/28"
                  className="text-gray-400 hover:text-white"
                >
                  Motor-Sport
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 inline-flex items-center hover:text-white"
                >
                  View All Categories <ArrowRight />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@ecommerce.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Commerce St, NY 10001</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
