import { useState } from "react";
import { ArrowLeft, Mail, Send, Clock, User, ChevronRight, Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";

interface Message {
  id: string;
  from: string;
  flatNumber: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  from: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: "1",
    from: "Rahul Sharma",
    flatNumber: "A-101",
    subject: "Water Leakage Issue",
    message: "There is a water leakage in the bathroom ceiling. It seems to be coming from the flat above. Please look into this urgently as it's causing damage to the walls.",
    timestamp: "2025-01-16T10:30:00",
    isRead: false,
    replies: [
      {
        id: "r1",
        from: "Admin",
        message: "Thank you for reporting. We have informed the maintenance team and they will visit your flat today between 2-4 PM.",
        timestamp: "2025-01-16T11:00:00",
        isAdmin: true
      }
    ]
  },
  {
    id: "2",
    from: "Priya Patel",
    flatNumber: "B-205",
    subject: "Parking Slot Request",
    message: "I would like to request an additional parking slot for my second vehicle. Please let me know the process and charges for the same.",
    timestamp: "2025-01-15T14:20:00",
    isRead: true,
    replies: []
  },
  {
    id: "3",
    from: "Amit Kumar",
    flatNumber: "C-302",
    subject: "Maintenance Payment Query",
    message: "I made a payment of ₹5,000 on 10th January but it's still showing as pending in the app. Please verify and update the status.",
    timestamp: "2025-01-14T09:15:00",
    isRead: true,
    replies: [
      {
        id: "r2",
        from: "Admin",
        message: "We have checked and your payment has been received. The status will be updated within 24 hours. Sorry for the inconvenience.",
        timestamp: "2025-01-14T10:30:00",
        isAdmin: true
      },
      {
        id: "r3",
        from: "Amit Kumar",
        message: "Thank you for the quick response!",
        timestamp: "2025-01-14T11:00:00",
        isAdmin: false
      }
    ]
  },
  {
    id: "4",
    from: "Sneha Reddy",
    flatNumber: "A-404",
    subject: "Guest Entry Issue",
    message: "The security guard is not allowing my regular house help to enter without calling me every day. Can we issue a monthly pass for domestic help?",
    timestamp: "2025-01-13T16:45:00",
    isRead: true,
    replies: []
  }
];

const Inbox = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-IN", { weekday: "short" });
    }
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const handleSelectMessage = (message: Message) => {
    // Mark as read
    if (!message.isRead) {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, isRead: true } : m)
      );
    }
    setSelectedMessage(message);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReply: Reply = {
      id: `r${Date.now()}`,
      from: "Admin",
      message: replyText.trim(),
      timestamp: new Date().toISOString(),
      isAdmin: true
    };

    setMessages(prev =>
      prev.map(m =>
        m.id === selectedMessage.id
          ? { ...m, replies: [...m.replies, newReply] }
          : m
      )
    );

    setSelectedMessage(prev => 
      prev ? { ...prev, replies: [...prev.replies, newReply] } : null
    );

    setReplyText("");
    setIsSending(false);
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully.",
    });
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      <header className=" top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => selectedMessage ? setSelectedMessage(null) : navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {selectedMessage ? "Back to Inbox" : "Back"}
            </span>
          </button>
          <h1 className="text-lg font-semibold text-foreground">
            {selectedMessage ? "Message" : "Inbox"}
          </h1>
          <div className="w-16 flex justify-end">
            {!selectedMessage && unreadCount > 0 && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedMessage ? (
            /* Message List */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-border"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.button
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                      !message.isRead ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !message.isRead ? "bg-accent/20" : "bg-muted"
                      }`}>
                        <User className={`h-5 w-5 ${!message.isRead ? "text-accent" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium truncate ${
                              !message.isRead ? "text-foreground" : "text-foreground"
                            }`}>
                              {message.from}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.flatNumber}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm mb-1 truncate ${
                          !message.isRead ? "font-medium text-foreground" : "text-foreground"
                        }`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.message}
                        </p>
                        {message.replies.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Reply className="h-3 w-3 text-accent" />
                            <span className="text-xs text-accent">
                              {message.replies.length} {message.replies.length === 1 ? "reply" : "replies"}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          ) : (
            /* Message Detail */
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Original Message */}
              <div className="bg-card rounded-xl border border-border p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{selectedMessage.from}</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedMessage.flatNumber}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(selectedMessage.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {selectedMessage.subject}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Replies */}
              {selectedMessage.replies.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Conversation
                  </h3>
                  {selectedMessage.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${
                        reply.isAdmin
                          ? "bg-accent/10 border border-accent/20 ml-4"
                          : "bg-muted mr-4"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${
                          reply.isAdmin ? "text-accent" : "text-foreground"
                        }`}>
                          {reply.from}
                        </span>
                        {reply.isAdmin && (
                          <Badge variant="default" className="text-xs bg-accent/20 text-accent">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(reply.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{reply.message}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Send Reply</h3>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="bg-background resize-none mb-3"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Reply
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Inbox;
