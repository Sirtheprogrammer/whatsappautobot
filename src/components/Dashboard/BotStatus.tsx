
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Clock, Database, User, Activity, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface BotStatistic {
  messages_received: number;
  messages_sent: number;
  commands_used: number;
  uptime_seconds: number;
}

export const BotStatus = () => {
  const [statistics, setStatistics] = useState<BotStatistic | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Fetch initial statistics
    fetchStatistics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bot_statistics'
        },
        (payload) => {
          if (payload.new) {
            setStatistics(payload.new as BotStatistic);
            setLastUpdated(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStatistics = async () => {
    const { data, error } = await supabase
      .from('bot_statistics')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setStatistics(data);
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-bot-gold">Bot Status</h2>
      <div className="grid gap-4">
        <StatusItem 
          icon={Activity} 
          label="Status" 
          value={isActive ? "Online" : "Offline"} 
          valueClassName={isActive ? "text-green-500" : "text-red-500"}
        />
        <StatusItem 
          icon={Clock} 
          label="Uptime" 
          value={statistics ? formatUptime(statistics.uptime_seconds) : "00:00:00"} 
        />
        <StatusItem 
          icon={MessageSquare} 
          label="Messages" 
          value={statistics ? `${statistics.messages_received} received / ${statistics.messages_sent} sent` : "0/0"} 
        />
        <StatusItem 
          icon={Database} 
          label="Commands Used" 
          value={statistics ? statistics.commands_used.toString() : "0"} 
        />
        <StatusItem 
          icon={Clock} 
          label="Last Updated" 
          value={lastUpdated.toLocaleTimeString()} 
        />
      </div>
    </Card>
  );
};

const StatusItem = ({ 
  icon: Icon, 
  label, 
  value, 
  valueClassName = "text-white" 
}: { 
  icon: any; 
  label: string; 
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-bot-gold" />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
  </div>
);
