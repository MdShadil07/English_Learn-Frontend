import { motion } from 'framer-motion';
import { Users, X, Loader2 } from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface JoinRoomModalProps {
  room: RoomDetails;
  onJoin: () => void;
  onCancel: () => void;
  isJoining: boolean;
}

const JoinRoomModal = ({ room, onJoin, onCancel, isJoining }: JoinRoomModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">Join Practice Room</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Room ID: {room.roomId}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Room Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  variant={room.status === 'active' ? 'default' : 'secondary'}
                  className={room.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {room.status === 'active' ? 'Active' : 'Closed'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Participants</span>
                <span className="text-sm font-medium">
                  {room.participantCount}/{room.maxParticipants}
                </span>
              </div>

              {room.topic && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Topic</span>
                  <span className="text-sm font-medium">{room.topic}</span>
                </div>
              )}

              {room.description && (
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {room.description}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isJoining}
              >
                Cancel
              </Button>
              <Button
                onClick={onJoin}
                className="flex-1"
                disabled={isJoining || room.status !== 'active' || room.participantCount >= room.maxParticipants}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : room.participantCount >= room.maxParticipants ? (
                  'Room Full'
                ) : (
                  'Join Room'
                )}
              </Button>
            </div>

            {/* Room Full Message */}
            {room.participantCount >= room.maxParticipants && (
              <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This room is currently full. Please try again later or ask the host to increase the participant limit.
                </p>
              </div>
            )}

            {/* Room Closed Message */}
            {room.status !== 'active' && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  This room is currently closed and not accepting new participants.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default JoinRoomModal;