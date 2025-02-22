import React from 'react'

type BotStatus = 'connected' | 'disconnected' | 'connecting'

interface BotConnectionPanelProps {
  botStatus: BotStatus
}

export const BotConnectionPanel: React.FC<BotConnectionPanelProps> = ({ botStatus }) => {
  const getStatusMessage = () => {
    switch (botStatus) {
      case 'connected':
        return 'Bot is Connected ✅'
      case 'disconnected':
        return 'Bot is Disconnected ❌'
      case 'connecting':
        return 'Connecting to WhatsApp...'
    }
  }

  return (
    <div className="bot-connection-panel p-4 border rounded">
      <h2 className="text-lg font-semibold mb-4">WhatsApp Bot Status</h2>
      <div className="status-indicator">
        <p>{getStatusMessage()}</p>
        
        {botStatus === 'disconnected' && (
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect Bot
          </button>
        )}

        {botStatus === 'connecting' && (
          <div className="mt-4 flex items-center">
            <div className="animate-spin mr-2">🔄</div>
            <span>Establishing connection...</span>
          </div>
        )}

        {botStatus === 'connected' && (
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  )
}