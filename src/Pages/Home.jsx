import ChatBar from "../Component/ChatBar";
import { useState } from "react";

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">FinTrust Bank</h1>
        <nav className="space-x-6">
          <button className="text-gray-700 hover:text-blue-600">Home</button>
          <button className="text-gray-700 hover:text-blue-600">Accounts</button>
          <button className="text-gray-700 hover:text-blue-600">Investments</button>
          <button className="text-gray-700 hover:text-blue-600">Cards</button>
          <button className="text-gray-700 hover:text-blue-600">Support</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to FinTrust Bank
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Empowering your financial journey — from savings and investments to loans
            and insurance, all in one secure place.
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg shadow-md transition"
          >
            💬 Apply for Personal Loan
          </button>
        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Bank Illustration"
          className="w-80 md:w-[400px] mt-10 md:mt-0"
        />
      </section>

      {/* Features */}
      <section className="px-10 py-16 bg-gray-50 text-center">
        <h3 className="text-3xl font-semibold text-gray-800 mb-10">
          Why Choose FinTrust?
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Instant Loans</h4>
            <p className="text-gray-600">
              Get personal or education loans in minutes with minimum documentation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Secure Banking</h4>
            <p className="text-gray-600">
              Advanced encryption and AI fraud detection to protect your funds.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">
              24x7 Customer Support
            </h4>
            <p className="text-gray-600">
              Our team is always here to help you with your banking needs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6">
        <p>© 2025 FinTrust Bank. All rights reserved.</p>
      </footer>

      {/* Chat Popup */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end md:items-center z-50">
          <div className="relative bg-white w-full md:w-[420px] rounded-2xl shadow-2xl overflow-hidden">
            <ChatBar onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
