import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Copy,
  Share2,
  Crown,
  Users,
  Settings,
  X
} from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

interface RoomHeaderProps {
  room: RoomDetails;
  isHost: boolean;
  onLeaveRoom: () => void;
  onCloseRoom: () => void;
  onCopyId: () => void;
  onShare: () => void;
}

const RoomHeader = ({
  room,
  isHost,
  onLeaveRoom,
  onCloseRoom,
  onCopyId,
  onShare
}: RoomHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Room Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Practice Room
                </h1>
                <p className="text-sm text-gray-500">
                  Room ID: {room.roomId}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant={room.status === 'active' ? 'default' : 'secondary'}
              className={room.status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {room.status === 'active' ? 'Active' : 'Closed'}
            </Badge>

            {/* Host Indicator */}
            {isHost && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Host
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Participants Count */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {room.participantCount}/{room.maxParticipants}
            </span>
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyId}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy ID
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          {/* Host Actions */}
          {isHost && room.status === 'active' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onCloseRoom}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close Room
            </Button>
          )}

          {/* Leave Room */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveRoom}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Leave Room
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomHeader;