import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Send, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "../components/layout/Header";

interface AdminContact {
  phone: string;
  email: string;
  name: string;
}

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminContact, setAdminContact] = useState<AdminContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(true);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  // Fetch admin contact on mount
  useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/contact`
        );
        
        if (res.ok) {
          const data = await res.json();
          setAdminContact(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin contact:', error);
      } finally {
        setLoadingContact(false);
      }
    };

    fetchAdminContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({ subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
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
        </div>
      </header>

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
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a question or concern? We're here to help.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              {loadingContact ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {adminContact?.phone || 'Not available'}
                </p>
              )}
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              {loadingContact ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {adminContact?.email || 'Not available'}
                </p>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              {/* Blur Overlay */}
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center border-border border-2">
                <div className="text-center px-6">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h4 className="text-lg font-semibold text-foreground mb-1">Coming Soon</h4>
                  <p className="text-sm text-muted-foreground">
                    Direct messaging feature is under development
                  </p>
                </div>
              </div>

              {/* Form (blurred) */}
              <div className="bg-card rounded-xl border border-border p-6 pointer-events-none">
                <h3 className="text-lg font-semibold text-foreground mb-4">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Office Hours:</span>{" "}
                Monday - Saturday, 10:00 AM - 6:00 PM
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;