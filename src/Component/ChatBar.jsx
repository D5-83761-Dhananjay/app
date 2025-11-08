import { useState, useEffect, useRef } from "react";

export default function ChatBar({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [flowType, setFlowType] = useState(null); // "cfa" or "wedding"
  const [step, setStep] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text, options = null, fileUpload = false) => {
    setMessages((prev) => [...prev, { sender: "bot", text, options, fileUpload }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleOptionSelect = (option) => {
    addUserMessage(option.label);
    setMessages((prev) => prev.map((m) => ({ ...m, options: null })));
    setTimeout(() => handleNextStep(option.value), 600);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const input = userInput.trim();
    addUserMessage(input);
    setUserInput("");

    if (!flowType) {
      detectFlow(input);
    } else {
      setTimeout(() => handleNextStep(input), 600);
    }
  };

  const detectFlow = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("cfa") || lower.includes("education")) {
      setFlowType("cfa");
      setStep(1);
      addBotMessage(
        "Dear Customer,\n\nWe truly understand how important professional education like the CFA program is for your career growth, and we’d be happy to assist you with the right personal loan solution to make the process smooth and stress-free.\n\nWe’d be happy to explore suitable personal loan options for you.\nTo begin, may I know if you’re an existing customer with us?",
        [
          { label: "👉 Yes", value: "yes" },
          { label: "❌ No", value: "no" },
        ]
      );
    } else if (lower.includes("wedding") || lower.includes("marriage")) {
      setFlowType("wedding");
      setStep(1);
      addBotMessage(
        "Dear Customer,\n\nThank you for reaching out and considering us for your financial needs. Congratulations on your upcoming wedding! 🎉\n\nWe’d be happy to explore suitable personal loan options for you.\nTo begin, may I know if you’re an existing customer with us?",
        [
          { label: "👉 Yes", value: "yes" },
          { label: "❌ No", value: "no" },
        ]
      );
    } else {
      addBotMessage(
        "Could you please specify if you’re looking for a personal loan for CFA education or for Wedding expenses?"
      );
    }
  };

  // File upload handler (multi-step doc flow)
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      addUserMessage(`Uploaded: ${fileName}`);

      if (flowType === "cfa" && step === 7) {
        const nextDoc = uploadedDocs + 1;
        setUploadedDocs(nextDoc);
        if (nextDoc === 1) {
          addBotMessage("✅ Got your CFA enrollment proof.\nPlease upload your ABC Number certificate next.", null, true);
        } else if (nextDoc === 2) {
          addBotMessage("✅ ABC Number received.\nFinally, upload your academic marksheets (10th, 12th, UG & PG).", null, true);
        } else if (nextDoc === 3) {
          addBotMessage("✅ All documents received successfully.\nVerifying your details...");
          setTimeout(() => handleNextStep("cfa_all_docs_uploaded"), 1500);
        }
      } else if (flowType === "wedding" && step === 3) {
        const nextDoc = uploadedDocs + 1;
        setUploadedDocs(nextDoc);
        if (nextDoc === 1) {
          addBotMessage("✅ Got your 3 months’ salary slips.\nPlease upload your 6 months’ bank statement next.", null, true);
        } else if (nextDoc === 2) {
          addBotMessage("✅ Bank statement received.\nFinally, upload your PAN and Aadhaar card.", null, true);
        } else if (nextDoc === 3) {
          addBotMessage("✅ All required documents received successfully.\nVerifying your profile...");
          setTimeout(() => handleNextStep("wedding_all_docs_uploaded"), 1500);
        }
      }
    }
  };

  // MAIN FLOW HANDLER
  const handleNextStep = (inputValue) => {
    // 🎓 CFA Education Loan Flow
    if (flowType === "cfa") {
      switch (step) {
        case 1:
          if (inputValue === "yes") {
            addBotMessage("Excellent! Please share your PAN card number for verification 😊");
            setStep(2);
          } else {
            addBotMessage("That’s perfectly fine! Welcome aboard. 😊\nPlease share:\n1️⃣ Monthly income\n2️⃣ Employment type (salaried/self-employed)\n3️⃣ Any existing EMIs or loans");
            setStep(8);
          }
          break;

        case 2:
          addBotMessage(
            "Welcome Saurabh,\n\nThank you for being one of our valued customers.\nWould you like me to share more details about Personal Loan options for education purposes?",
            [
              { label: "✅ Yes, please", value: "yes" },
              { label: "❌ No, thank you", value: "no" },
              { label: "🤔 Maybe later", value: "later" },
            ]
          );
          setStep(3);
          break;

        case 3:
          if (inputValue === "yes") {
            addBotMessage("Great! Please mention the approximate amount you require for your CFA course (e.g. ₹2,00,000)");
            setStep(4);
          } else {
            addBotMessage("Sure! You can reach out anytime 😊");
            setStep(0);
          }
          break;

        case 4: {
          const amt = parseInt(inputValue.replace(/[^0-9]/g, ""));
          if (isNaN(amt)) return addBotMessage("Please enter a valid amount like ₹2,00,000");
          setLoanAmount(amt);
          addBotMessage(
            `Thank you! Based on your relationship, ₹${amt.toLocaleString()} is within your eligible range.\nPlease choose your loan tenure:`,
            [
              { label: "1 year", value: "1" },
              { label: "2 years", value: "2" },
              { label: "3 years", value: "3" },
            ]
          );
          setStep(5);
          break;
        }

        case 5: {
          const years = parseInt(inputValue);
          const months = years * 12;
          const rate = 12.25 / 100 / 12;
          const emi = Math.round(
            (loanAmount * rate * Math.pow(1 + rate, months)) /
              (Math.pow(1 + rate, months) - 1)
          );
          addBotMessage(
            `Here’s your personalized loan summary:\n• Loan Amount: ₹${loanAmount.toLocaleString()}\n• Tenure: ${months} months (${years} years)\n• Interest Rate: 12.25% p.a.\n• EMI: ₹${emi.toLocaleString()}/month\n• Processing Fee: ₹799\n\nWould you like to proceed?`,
            [
              { label: "✅ Yes, proceed", value: "yes" },
              { label: "⏳ Maybe later", value: "no" },
            ]
          );
          setStep(6);
          break;
        }

        case 6:
          if (inputValue === "yes") {
            addBotMessage(
              "Perfect! Please upload these documents one by one:\n1️⃣ CFA course enrollment proof or fee receipt\n2️⃣ ABC (Academic Bank of Credits) Number\n3️⃣ Academic Marksheets (10th, 12th, UG & PG)",
              null,
              true
            );
            setStep(7);
          } else {
            addBotMessage("Alright! You can resume anytime later 😊");
            setStep(0);
          }
          break;

        case 7:
          if (inputValue === "cfa_all_docs_uploaded") {
            addBotMessage("✅ Documents verified successfully.\nYour loan of ₹2,00,000 is approved in principle.\nWould you like to proceed to final sanction?", [
              { label: "✅ Yes, confirm", value: "yes" },
              { label: "❌ No", value: "no" },
            ]);
            setStep(9);
          }
          break;

        case 9:
          if (inputValue === "yes") {
            addBotMessage(
              "🎉 Wonderful! Your loan has been sanctioned successfully.\n• Loan: ₹2,00,000\n• Tenure: 24 months (2 years)\n• Rate: 12.25% p.a.\n• EMI: ₹9,469/month\n\nYou’ll receive your sanction letter shortly on email."
            );
            setTimeout(() => {
              addBotMessage(
                "Dear Saurabh,\nWe’re pleased to inform you that your Personal Loan for CFA course has been sanctioned successfully.\nPlease check your registered email for your official Loan Sanction Letter.\n\nWarm regards,\nCustomer Relationship Team"
              );
            }, 1500);
          }
          setStep(0);
          break;

        case 8:
          addBotMessage(
            "Thank you for the info. Based on your ₹35,000/month income, you’re pre-approved for ₹1,00,000.\nHowever, since you requested ₹10 lakh, please upload the following:\n• 3 months’ salary slips\n• 6 months’ bank statement\n• PAN & Aadhaar",
            null,
            true
          );
          setStep(3);
          break;

        default:
          break;
      }
    }

    // 💍 Wedding Loan Flow
    if (flowType === "wedding") {
      switch (step) {
        case 1:
          if (inputValue === "yes") {
            addBotMessage("Great! Please share your PAN card number for verification.");
            setStep(2);
          } else {
            addBotMessage("That’s perfectly fine! Welcome aboard. 😊\nTo check eligibility, please share:\n1️⃣ Monthly income\n2️⃣ Employment type (salaried/self-employed)\n3️⃣ Any existing EMIs or loans");
            setStep(2);
          }
          break;

        case 2:
          addBotMessage(
            "Thanks for the info. Based on your ₹35,000/month income, you’re pre-approved for ₹1,00,000.\nHowever, since you requested ₹10 lakh, please upload these docs:\n• Latest 3 months’ salary slips\n• Bank statement (6 months)\n• PAN and Aadhaar",
            null,
            true
          );
          setStep(3);
          break;

        case 3:
          if (inputValue === "wedding_all_docs_uploaded") {
            addBotMessage(
              "✅ All documents received.\nThank you! However, for ₹10 lakh approval, we need full income & banking proofs.\nWithout them, we can proceed only with ₹1 lakh.\nWould you like to continue?",
              [
                { label: "✅ Yes, proceed with ₹1 lakh", value: "yes" },
                { label: "❌ No, I prefer to wait", value: "no" },
              ]
            );
            setStep(4);
          }
          break;

        case 4:
          if (inputValue === "yes") {
            addBotMessage(
              "Noted. Processing your ₹1 lakh loan request. ✅\nYou’ll receive the confirmation shortly!"
            );
          } else {
            addBotMessage(
              "I completely understand your preference. Once full documents are shared or income increases, we’ll reassess your ₹10 lakh request.\nWould you like to be notified when you’re eligible?",
              [
                { label: "✅ Yes, notify me", value: "yes_notify" },
                { label: "❌ No, thank you", value: "no_notify" },
              ]
            );
            setStep(5);
          }
          break;

        case 5:
          if (inputValue === "yes_notify") {
            addBotMessage(
              "Thank you for your understanding. We’ve safely stored your details, and we’ll notify you once you qualify for a higher amount.\nWishing you a wonderful wedding and bright future ahead! 💍✨"
            );
          } else {
            addBotMessage("Sure! You can reach out anytime you’re ready. 😊");
          }
          setStep(0);
          break;

        default:
          break;
      }
    }
  };

  return (
    <div className="fixed right-4 bottom-4 w-[95%] md:w-[380px] h-[80vh] bg-white shadow-2xl rounded-2xl border flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Personal Loan Assistant</h2>
        <button onClick={onClose} className="text-white text-xl font-bold">×</button>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
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
              <div className="flex flex-wrap gap-2 mt-2">
                {msg.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-white border px-3 py-2 rounded-full shadow-sm cursor-pointer hover:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name={`option-${i}`}
                      value={opt.value}
                      onChange={() => handleOptionSelect(opt)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {msg.sender === "bot" && msg.fileUpload && (
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileUpload}
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:px-3 file:py-1"
                />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleUserSubmit} className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">
          Send
        </button>
      </form>
    </div>
  );
}
