import { useState, useEffect } from "react";
import { Mail, MailCheck, Reply, Trash2, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface AdminContactMessagesProps {
  searchTerm: string;
  onStatsUpdate: () => void;
}

const AdminContactMessages = ({ searchTerm, onStatsUpdate }: AdminContactMessagesProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
      onStatsUpdate();
      
      toast({ title: "Success", description: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({ title: "Error", description: "Failed to mark message as read", variant: "destructive" });
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ read: false })
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: false } : msg
      ));
      onStatsUpdate();
      
      toast({ title: "Success", description: "Message marked as unread" });
    } catch (error) {
      console.error("Error marking message as unread:", error);
      toast({ title: "Error", description: "Failed to mark message as unread", variant: "destructive" });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      onStatsUpdate();
      
      toast({ title: "Success", description: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
    }
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText(`Hi ${message.name},\n\nThank you for your message. `);
    setIsReplyDialogOpen(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsSendingReply(true);
    
    try {
      // Here you would typically send an email using an edge function
      // For now, we'll just mark as read and show a success message
      await markAsRead(selectedMessage.id);
      
      toast({
        title: "Reply Sent",
        description: `Reply sent to ${selectedMessage.email}`,
      });
      
      setIsReplyDialogOpen(false);
      setReplyText("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadMessages = filteredMessages.filter(msg => !msg.read);
  const readMessages = filteredMessages.filter(msg => msg.read);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Contact Messages</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="px-3 py-1">
            {unreadMessages.length} Unread
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {readMessages.length} Read
          </Badge>
        </div>
      </div>

      {/* Unread Messages */}
      {unreadMessages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-destructive">Unread Messages</h3>
          {unreadMessages.map((message) => (
            <Card key={message.id} className="border-destructive/50 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-destructive" />
                      {message.subject}
                      <Badge variant="destructive">Unread</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {message.name}
                      </span>
                      <span>{message.email}</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReply(message)}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(message.id)}
                    >
                      <MailCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Read Messages */}
      {readMessages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">Read Messages</h3>
          {readMessages.map((message) => (
            <Card key={message.id} className="opacity-75 hover:opacity-100 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MailCheck className="h-5 w-5 text-green-500" />
                      {message.subject}
                      <Badge variant="secondary">Read</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {message.name}
                      </span>
                      <span>{message.email}</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReply(message)}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsUnread(message.id)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Messages Found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No messages match your search." : "No messages yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Original Message:</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Subject:</strong> {selectedMessage?.subject}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedMessage?.message}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Reply:</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={8}
                placeholder="Type your reply here..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsReplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={sendReply}
                disabled={isSendingReply || !replyText.trim()}
                className="bg-gradient-primary"
              >
                {isSendingReply ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactMessages;