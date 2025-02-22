
import React from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, User } from 'lucide-react';

interface UserInfoProps {
  owner: string;
  rank: string;
  xp: number;
  username: string;
}

export const UserInfo = ({ owner, rank, xp, username }: UserInfoProps) => {
  return (
    <Card className="p-6 bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-bot-gold">User Info</h2>
      <div className="grid gap-4">
        <InfoItem icon={User} label="Owner" value={owner} />
        <InfoItem icon={Trophy} label="Rank" value={rank} />
        <InfoItem icon={Trophy} label="XP" value={xp.toString()} />
        <InfoItem icon={User} label="User" value={username} />
      </div>
    </Card>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-bot-gold" />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);
