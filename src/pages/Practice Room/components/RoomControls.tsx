import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  PhoneOff
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../../../components/ui/dropdown-menu';

interface VoiceControlsProps {
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onVolumeChange: (volume: number) => void;
  onLeaveCall: () => void;
  isHost: boolean;
}

const RoomControls = ({
  isMuted,
  isDeafened,
  volume,
  onToggleMute,
  onToggleDeafen,
  onVolumeChange,
  onLeaveCall,
  isHost
}: VoiceControlsProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Controls</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Audio Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowVolumeSlider(!showVolumeSlider)}>
              Adjust Volume
            </DropdownMenuItem>
            <DropdownMenuItem>
              Test Microphone
            </DropdownMenuItem>
            <DropdownMenuItem>
              Test Speakers
            </DropdownMenuItem>
            {isHost && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Host Controls</DropdownMenuLabel>
                <DropdownMenuItem>
                  Mute All Participants
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Lock Room
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Volume Slider */}
      {showVolumeSlider && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-gray-500" />
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
              {volume}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Mute/Unmute Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="lg"
            onClick={onToggleMute}
            className={`h-14 w-14 rounded-full ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </motion.div>

        {/* Deafen/Undeafen Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isDeafened ? "destructive" : "outline"}
            size="lg"
            onClick={onToggleDeafen}
            className={`h-14 w-14 rounded-full ${
              isDeafened
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {isDeafened ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>
        </motion.div>

        {/* Leave Call Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="destructive"
            size="lg"
            onClick={onLeaveCall}
            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
        <div className={`flex items-center gap-2 ${isMuted ? 'text-red-600' : 'text-green-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`} />
          {isMuted ? 'Muted' : 'Unmuted'}
        </div>
        <div className={`flex items-center gap-2 ${isDeafened ? 'text-red-600' : 'text-green-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isDeafened ? 'bg-red-500' : 'bg-green-500'}`} />
          {isDeafened ? 'Deafened' : 'Undeafened'}
        </div>
      </div>

      {/* Voice Activity Indicator */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Voice connected</span>
        </div>
        <p className="text-xs text-blue-600 mt-1 text-center">
          Your microphone is active and ready for conversation
        </p>
      </div>
    </motion.div>
  );
};

export default RoomControls;