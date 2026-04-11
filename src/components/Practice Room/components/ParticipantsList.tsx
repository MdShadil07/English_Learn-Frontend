import { motion } from 'framer-motion';
import { Crown, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';

interface ParticipantsListProps {
  room: RoomDetails;
  currentUserId: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    isHost: boolean;
    isMuted: boolean;
    isSpeaking: boolean;
  }>;
}

const ParticipantsList = ({
  room,
  currentUserId,
  participants
}: ParticipantsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Participants ({participants.length}/{room.maxParticipants})
        </h2>
        <Badge variant="outline">
          {room.status === 'active' ? 'Active' : 'Closed'}
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              participant.id === currentUserId
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Speaking Indicator */}
                {participant.isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Volume2 className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {participant.name}
                  </span>
                  {participant.isHost && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {participant.id === currentUserId && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {participant.isMuted ? (
                    <MicOff className="h-3 w-3 text-red-500" />
                  ) : (
                    <Mic className="h-3 w-3 text-green-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {participant.isMuted ? 'Muted' : 'Unmuted'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {participant.isHost && (
                <Badge variant="outline" className="text-xs">
                  Host
                </Badge>
              )}
              {participant.isSpeaking && (
                <div className="flex items-center gap-1 text-green-600">
                  <Volume2 className="h-3 w-3" />
                  <span className="text-xs">Speaking</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Room Capacity Warning */}
      {participants.length >= room.maxParticipants * 0.8 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            Room is nearing capacity. Consider creating a new room for more participants.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParticipantsList;