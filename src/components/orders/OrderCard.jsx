// src/components/orders/OrderCard.jsx
import React from "react";

const OrderCard = ({ order, onCancelOrder }) => {
  const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const deliveredDate = order.deliveredDate
    ? new Date(order.deliveredDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const getStatusBadge = () => {
    const statusColors = {
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}
      >
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
            <p className="text-sm text-gray-600">Placed on {orderDate}</p>
          </div>
          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {order.status === "processing" && (
              <button
                onClick={() => onCancelOrder(order.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain bg-gray-50 rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Shipping Address:</span>{" "}
              {order.shippingAddress}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Payment Method:</span>{" "}
              {order.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Estimated Delivery: {deliveryDate}
            </p>
            {deliveredDate && (
              <p className="text-sm text-green-600">
                Delivered on: {deliveredDate}
              </p>
            )}
            <p className="text-lg font-bold text-gray-900">
              Total: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
