
import React from 'react';
import { UserInfo } from '@/components/Dashboard/UserInfo';
import { BotStatus } from '@/components/Dashboard/BotStatus';
import { BotConfiguration } from '@/components/Dashboard/BotConfiguration';
import { WhatsAppConnect } from '@/components/Dashboard/WhatsAppConnect';
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/eb1725fc-d1d5-4ede-9b9f-decb5defc978.png" 
            alt="SirTheProgrammer Logo" 
            className="w-32 h-32 mx-auto rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold text-bot-gold mb-2">SirTheProgrammer Bot</h1>
        <p className="text-gray-400">{"Quote of the day: Why don't some couples go to the gym? Because some relationships don't work out."}</p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <UserInfo 
          owner="baraka kibiki"
          rank="Tadpole"
          xp={443}
          username="Sirtheprogrammer"
        />
        
        <BotStatus />
        
        <BotConfiguration />

        {/* WhatsApp Connection */}
        <div className="col-span-full">
          <WhatsAppConnect />
        </div>

        {/* Menu Section */}
        <Card className="p-6 bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl col-span-full animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-bot-gold">Main Menu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'allmenu',
              'aimenu',
              'aeditor',
              'animemenu',
              'autoreact',
              'botmenu',
              'dlmenu',
              'economy',
              'enable'
            ].map((item) => (
              <button
                key={item}
                className="p-3 text-sm bg-white/5 rounded-lg hover:bg-bot-gold hover:text-black transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-sm text-gray-400 animate-fade-in">
        <p>© 2024 SirTheProgrammer Bot. All rights reserved.</p>
        <p>Owner: +255617200014</p>
      </footer>
    </div>
  );
};

export default Index;
