import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "../components/layout/Header";

const faqs = [
  {
    question: "How do I pay my maintenance dues?",
    answer: "You can pay your maintenance dues by clicking on the 'Pay Now' button on the dashboard. You can use UPI, credit/debit card, or net banking to complete the payment."
  },
  {
    question: "What happens if I miss a payment deadline?",
    answer: "If you miss a payment deadline, a late fee may be applied to your next bill. We recommend setting up reminders to avoid missing payments."
  },
  {
    question: "How can I view my payment history?",
    answer: "Your payment history is available on the dashboard. Scroll down to the 'Payment History' section to view all your past transactions."
  },
  {
    question: "How do I download a receipt for my payment?",
    answer: "After completing a payment, you can download the receipt from the 'View Receipts' option in Quick Actions, or from the payment history section."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We are only accepting accept UPI payments (Google Pay, PhonePe, Paytm, etc.) for now. We will implement netbanking to accept credit/debit cards in the near future."
  },
  {
    question: "How do I update my contact information?",
    answer: "Go to your Profile page by clicking on the profile icon in the header. From there, you can update your phone number, email, and other details."
  },
  {
    question: "Who do I contact for maintenance issues in my flat?",
    answer: "For maintenance issues within your flat, please use the 'Contact Admin' option to send a message to the society management team."
  },
  {
    question: "How are maintenance charges calculated?",
    answer: "Maintenance charges are calculated based on the flat size, common area maintenance, security, lift maintenance, and other society amenities."
  }
];

const HelpFAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      <header className="top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          {/* <h1 className="text-lg font-semibold text-foreground">Help & FAQ</h1> */}
          {/* <div className="w-16" /> */}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">How can we help?</h2>
            <p className="text-muted-foreground">
              Find answers to commonly asked questions below
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 text-left">
                    <span className="text-sm font-medium text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Still need help?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                <span className="text-sm font-medium text-accent">Contact Admin</span>
                <ChevronRight className="h-4 w-4 text-accent" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default HelpFAQ;
