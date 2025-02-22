
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BotConfig {
  id: string;  // Added this line to fix the TypeScript error
  anti_view_once: boolean;
  auto_status_view: boolean;
  auto_typing: boolean;
  auto_recording: boolean;
}

export const BotConfiguration = () => {
  const [config, setConfig] = useState<BotConfig>({
    id: '',  // Added initial value for id
    anti_view_once: false,
    auto_status_view: false,
    auto_typing: false,
    auto_recording: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bot_configurations'
        },
        (payload) => {
          if (payload.new) {
            setConfig(payload.new as BotConfig);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('bot_configurations')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setConfig(data);
    }
  };

  const updateConfig = async (key: keyof Omit<BotConfig, 'id'>, value: boolean) => {
    const { error } = await supabase
      .from('bot_configurations')
      .update({ [key]: value })
      .eq('id', config.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Configuration updated successfully"
      });
      setConfig({ ...config, [key]: value });
    }
  };

  return (
    <Card className="p-6 bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-6 h-6 text-bot-gold" />
        <h2 className="text-2xl font-bold text-bot-gold">Bot Configuration</h2>
      </div>
      <div className="grid gap-4">
        <ConfigItem
          label="Anti View Once"
          description="Save view once messages automatically"
          checked={config.anti_view_once}
          onCheckedChange={(checked) => updateConfig('anti_view_once', checked)}
        />
        <ConfigItem
          label="Auto Status View"
          description="Automatically view status updates"
          checked={config.auto_status_view}
          onCheckedChange={(checked) => updateConfig('auto_status_view', checked)}
        />
        <ConfigItem
          label="Auto Typing"
          description="Show typing indicator when processing commands"
          checked={config.auto_typing}
          onCheckedChange={(checked) => updateConfig('auto_typing', checked)}
        />
        <ConfigItem
          label="Auto Recording"
          description="Show recording indicator for voice responses"
          checked={config.auto_recording}
          onCheckedChange={(checked) => updateConfig('auto_recording', checked)}
        />
      </div>
    </Card>
  );
};

const ConfigItem = ({ 
  label, 
  description, 
  checked, 
  onCheckedChange 
}: { 
  label: string; 
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-white">{label}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-bot-gold"
    />
  </div>
);
