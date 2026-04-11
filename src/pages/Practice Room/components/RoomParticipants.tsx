import { motion } from 'framer-motion';
import { Crown, Users, ChevronDown, ChevronUp } from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';

interface RoomParticipantsProps {
  room: RoomDetails;
  isVisible: boolean;
  onToggle: () => void;
}

const RoomParticipants = ({ room, isVisible, onToggle }: RoomParticipantsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants ({room.participantCount})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            {isVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isVisible && (
        <CardContent className="pt-0">
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {room.participants.map((participantId, index) => (
                <motion.div
                  key={participantId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {participantId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {participantId}
                      </span>
                      {participantId === room.hostId && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="default"
                        className="text-xs"
                      >
                        Online
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Capacity Warning */}
          {room.participantCount >= room.maxParticipants * 0.8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p className="text-xs text-yellow-800 text-center">
                Room is nearing capacity
              </p>
            </motion.div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default RoomParticipants;