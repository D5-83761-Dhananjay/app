import { useState, useEffect, useRef } from "react";

export default function ChatBar({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(-1); // start before conversation
  const [maxLimit] = useState(500000);
  const [selectedTenure, setSelectedTenure] = useState(null); 
  const [loanAmount, setLoanAmount] = useState(null); 
  const [docsToUpload, setDocsToUpload] = useState([]); // queue for sequential document upload
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text, options = null, fileUpload = false) => {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text, options, fileUpload },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleOptionSelect = (option) => {
    addUserMessage(option.label);
    setMessages((prev) => prev.map((m) => ({ ...m, options: null })));

    if (["1", "2", "3"].includes(option.value)) {
      setSelectedTenure(parseInt(option.value));
    }

    setTimeout(() => handleNextStep(option.value), 600);
  };

  const handleNextStep = (inputValue) => {
    switch (step) {
      case -1:
        addBotMessage(
          "Dear Saurabh,\n\nWe truly understand how important professional education like the CFA program is for your career growth, and we’d be happy to assist you with the right personal loan solution to make the process smooth and stress-free.\n\nWe’d be happy to explore suitable personal loan options for you.\n\nAre you an existing customer with us?",
          [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]
        );
        setStep(0);
        break;

      case 0:
        if (inputValue === "yes") {
          addBotMessage(
            "Excellent! Please share your PAN card number for verification."
          );
          setStep(1);
        } else if (inputValue === "no") {
          addBotMessage(
            "That’s perfectly fine! Welcome aboard. 😊\n\nTo check your eligibility, please share the following details:\n1. Monthly income\n2. Current employment type (salaried/self-employed)\n3. Any existing EMIs or loans"
          );
          setStep(20);
        }
        break;

      // =========================
      // Existing customer flow
      // =========================
      case 1:
        addBotMessage(
          "Welcome Saurabh! Would you like to see personal loan options for education?",
          [
            { label: "Yes, please", value: "yes" },
            { label: "No, thank you", value: "no" },
          ]
        );
        setStep(2);
        break;

      case 2:
        if (inputValue === "yes") {
          addBotMessage(
            "Great! To help us find the best offer for you, may I know the approximate amount you require for your CFA course? \n(Example: ₹5 lakh for fees and materials)"
          );
          setStep(3);
        } else {
          addBotMessage("Sure, feel free to reach out whenever you’re ready.");
          setStep(-1);
        }
        break;

      case 3: {
        const amount = parseInt(inputValue);
        if (isNaN(amount)) {
          addBotMessage("Please enter a valid number for the amount.");
          return;
        }
        if (amount > maxLimit) {
          addBotMessage(
            `Sorry, your eligible limit is ₹${maxLimit.toLocaleString()}, so ₹${amount.toLocaleString()} cannot be processed.`
          );
          setStep(-1);
        } else {
          setLoanAmount(amount);
          addBotMessage(
            `Thank you, Saurabh. ₹${amount.toLocaleString()} fits within your eligibility.\n\nPlease choose a loan tenure:`,
            [
              { label: "1 year", value: "1" },
              { label: "2 years", value: "2" },
              { label: "3 years", value: "3" },
            ]
          );
          setStep(4);
        }
        break;
      }

      case 4: {
        const years = parseInt(inputValue);
        setSelectedTenure(years);

        addBotMessage(
          `Perfect! A ${years}-year tenure is a good choice.\n\nBefore we proceed, have there been any changes in your employment or income since your last update?`,
          [
            { label: "No changes", value: "no" },
            { label: "Yes, I’ve changed job or income", value: "yes" },
          ]
        );
        setStep(5);
        break;
      }

      case 5:
        if (inputValue === "no") {
          const amount = loanAmount || 200000;
          addBotMessage(
            `Excellent! You’re pre-qualified for ₹${amount.toLocaleString()} at 12.25% per annum.\nWould you like to see your loan summary?`,
            [
              { label: "Yes, show summary", value: "yes" },
              { label: "No, later", value: "no" },
            ]
          );
          setStep(6);
        } else {
          addBotMessage(
            "Please upload your last 3 months' salary slips below.",
            null,
            true
          );
          setStep(7);
        }
        break;

      case 7:
        addBotMessage(
          "Thank you! Your documents are verified successfully.\nYou’re pre-qualified for ₹2,00,000 at 12.25% p.a.\nWould you like to see your loan summary?",
          [
            { label: "Yes, show summary", value: "yes" },
            { label: "No, later", value: "no" },
          ]
        );
        setStep(6);
        break;

      case 6:
        if (inputValue === "yes") {
          const amount = loanAmount || 200000;
          const years = selectedTenure || 2;
          const months = years * 12;

          const rate = 12.25 / 100 / 12;
          const emi = Math.round(
            (amount * rate * Math.pow(1 + rate, months)) /
              (Math.pow(1 + rate, months) - 1)
          );

          addBotMessage(
            `Here’s your personalized loan summary:\n• Loan Amount: ₹${amount.toLocaleString()}\n• Tenure: ${months} months (${years} years)\n• Interest: 12.25% p.a.\n• EMI: ₹${emi.toLocaleString()}/month\n• Processing Fee: ₹799\n\nWould you like to proceed?`,
            [
              { label: "Yes, proceed", value: "yes" },
              { label: "Maybe later", value: "no" },
            ]
          );

          setStep(8);
        } else {
          addBotMessage("Sure! You can come back anytime to continue.");
          setStep(-1);
        }
        break;

      case 8:
        if (inputValue === "yes") {
          const amount = loanAmount || 200000;
          addBotMessage(
            `Perfect! Your loan has been sanctioned for ₹${amount} at 12.25% p.a.\nYou’ll receive your sanction letter shortly. 🎉`
          );
          setStep(-1);
        } else {
          addBotMessage(
            "No worries. We’ve saved your details for future reference."
          );
          setStep(-1);
        }
        break;

      // =========================
      // New customer flow
      // =========================
      case 20:
        addBotMessage(
          "Thanks for sharing your details. Could you please tell us the loan amount you are requesting for?"
        );
        setStep(21);
        break;

      case 21: {
        const amount = parseInt(inputValue);
        if (isNaN(amount)) {
          addBotMessage("Please enter a valid number for the loan amount.");
          return;
        }
        setLoanAmount(amount);

        // initialize document upload queue
        setDocsToUpload([
          "Latest 3 months’ salary slips",
          "Bank statement for 6 months",
          "PAN and Aadhaar"
        ]);

        addBotMessage(
          `Please upload your Latest 3 months’ salary slips:`,
          null,
          true
        );
        setStep(22);
        break;
      }

      case 22:
        if (inputValue === "uploaded_all") {
          if (loanAmount <= maxLimit) {
            addBotMessage(
              `Thank you! Your requested loan amount of ₹${loanAmount.toLocaleString()} is within our eligibility limit. Let's continue!`
            );
            setStep(0);
          } else {
            addBotMessage(
              `Thank you for uploading all documents. 🙏\n\nHowever, your requested loan amount of ₹${loanAmount.toLocaleString()} exceeds your pre-approved limit of ₹${maxLimit.toLocaleString()}.\nWe can process your pre-approved limit of ₹${maxLimit.toLocaleString()} for now.\n\nWould you like to continue with that offer?`,
              [
                {
                  label: "Yes, proceed with ₹" + maxLimit.toLocaleString(),
                  value: "yes",
                },
                { label: "No, I prefer to wait", value: "no" },
              ]
            );
            setStep(23);
          }
        }
        break;

      case 23:
        if (inputValue === "yes") {
          addBotMessage(
            `Perfect! Your pre-approved loan of ₹${maxLimit.toLocaleString()} will be processed. 🎉`
          );
          setStep(-1);
        } else {
          addBotMessage(
            "I completely understand. We’ll notify you when you become eligible for a higher amount in the future."
          );
          setStep(-1);
        }
        break;

      default:
        addBotMessage("Session completed. Thank you!");
        break;
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    addUserMessage(userInput);
    const input = userInput.trim();
    setUserInput("");
    setTimeout(() => handleNextStep(input), 600);
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      addUserMessage(`Uploaded: ${fileName}`);

      const remainingDocs = docsToUpload.slice(1);
      setDocsToUpload(remainingDocs);

      if (remainingDocs.length > 0) {
        setTimeout(() => {
          addBotMessage(`Please upload your ${remainingDocs[0]}:`, null, true);
        }, 600);
      } else {
        // All documents uploaded
        setTimeout(() => handleNextStep("uploaded_all"), 600);
      }
    }
  };

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 w-[95%] md:w-[370px] h-[80vh] md:h-[900px] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Personal Loan Assistant</h2>
        <button onClick={onClose} className="text-white text-xl font-bold">
          ×
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "bot" && msg.options && (
              <div className="flex flex-wrap gap-3 mt-2 ml-2">
                {msg.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-full shadow-sm cursor-pointer hover:bg-blue-50 transition"
                  >
                    <input
                      type="radio"
                      name={`option-${i}`}
                      value={opt.value}
                      onChange={() => handleOptionSelect(opt)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {msg.sender === "bot" && msg.fileUpload && (
              <div className="mt-2 ml-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleUserSubmit}
        className="p-3 border-t bg-white flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
