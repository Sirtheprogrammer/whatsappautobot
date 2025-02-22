
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  Phone, 
  Loader2, 
  MessageCircle, 
  KeyRound,
  Bot,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppSession {
  id: string;
  phone_number: string;
  is_active: boolean;
  last_connected: string;
  connection_status: string;
}

interface BotStats {
  messagesReceived: number;
  messagesSent: number;
  commandsUsed: number;
  uptime: string;
}

export const WhatsAppConnect = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'qr' | 'pairing'>('qr');
  const [botStats, setBotStats] = useState<BotStats>({
    messagesReceived: 0,
    messagesSent: 0,
    commandsUsed: 0,
    uptime: '0m'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentSession();
    const statsInterval = setInterval(fetchBotStats, 30000); // Update stats every 30s

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_sessions'
        },
        (payload) => {
          if (payload.new) {
            setSession(payload.new as WhatsAppSession);
          }
        }
      )
      .subscribe();

    return () => {
      if (socket) {
        socket.close();
      }
      clearInterval(statsInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCurrentSession = async () => {
    const { data, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setSession(data);
      fetchBotStats();
    }
  };

  const fetchBotStats = async () => {
    if (!session?.id) return;

    const { data: stats } = await supabase
      .from('bot_statistics')
      .select('*')
      .eq('session_id', session.id)
      .single();

    if (stats) {
      setBotStats({
        messagesReceived: stats.messages_received || 0,
        messagesSent: stats.messages_sent || 0,
        commandsUsed: stats.commands_used || 0,
        uptime: formatUptime(stats.uptime_seconds || 0)
      });
    }
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleConnect = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your WhatsApp number",
        variant: "destructive"
      });
      return;
    }

    if (connectionMethod === 'pairing' && !pairingCode) {
      toast({
        title: "Error",
        description: "Please enter the pairing code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/functions/v1/whatsapp-connect`);
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'init',
          phoneNumber,
          method: connectionMethod,
          pairingCode: connectionMethod === 'pairing' ? pairingCode : undefined
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'qr':
            setQrCode(data.qr);
            toast({
              title: "Success",
              description: "Scan the QR code to connect WhatsApp"
            });
            break;

          case 'connected':
            setQrCode(null);
            setIsLoading(false);
            toast({
              title: "Success",
              description: "WhatsApp connected successfully"
            });
            fetchCurrentSession();
            break;

          case 'error':
            setIsLoading(false);
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive"
            });
            break;
        }
      };

      ws.onerror = () => {
        toast({
          title: "Error",
          description: "WebSocket connection failed",
          variant: "destructive"
        });
        setIsLoading(false);
      };

      setSocket(ws);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate WhatsApp connection",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!session || !socket) return;

    try {
      socket.send(JSON.stringify({ type: 'disconnect' }));
      socket.close();
      setSocket(null);
      setQrCode(null);
      
      toast({
        title: "Success",
        description: "WhatsApp disconnected successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect WhatsApp",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-6 h-6 text-bot-gold" />
        <h2 className="text-2xl font-bold text-bot-gold">WhatsApp Connection</h2>
      </div>

      {session?.is_active ? (
        <div className="space-y-4">
          {/* Connected State UI */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-bot-gold" />
                <h3 className="font-medium text-white">Bot Status</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Connected Number: {session.phone_number}</p>
                <p className="text-xs text-gray-400">
                  Last connected: {new Date(session.last_connected).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-500">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-bot-gold" />
                <h3 className="font-medium text-white">Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Messages Received</p>
                  <p className="text-white font-medium">{botStats.messagesReceived}</p>
                </div>
                <div>
                  <p className="text-gray-400">Messages Sent</p>
                  <p className="text-white font-medium">{botStats.messagesSent}</p>
                </div>
                <div>
                  <p className="text-gray-400">Commands Used</p>
                  <p className="text-white font-medium">{botStats.commandsUsed}</p>
                </div>
                <div>
                  <p className="text-gray-400">Uptime</p>
                  <p className="text-white font-medium">{botStats.uptime}</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDisconnect}
          >
            Disconnect WhatsApp
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs defaultValue="qr" onValueChange={(value) => setConnectionMethod(value as 'qr' | 'pairing')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="pairing" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Pairing Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="WhatsApp number (with country code)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="bg-bot-gold hover:bg-bot-gold/90 text-black"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>

              {qrCode && (
                <div className="p-4 bg-white rounded-lg flex justify-center">
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="w-48 h-48"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="pairing" className="space-y-4">
              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="WhatsApp number (with country code)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
                <Input
                  type="text"
                  placeholder="Enter 8-digit pairing code"
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value)}
                  className="bg-white/5 border-white/10"
                  maxLength={8}
                />
                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full bg-bot-gold hover:bg-bot-gold/90 text-black"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Connect with Pairing Code"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {connectionMethod === 'qr' 
                ? "Scan the QR code using WhatsApp on your phone"
                : "Get the pairing code from WhatsApp > Linked Devices > Link with phone number"
              }
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
