import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  BookOpen,
  Trophy,
  Clock
} from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

interface RoomSidebarProps {
  room: RoomDetails;
  currentUserId: string;
  onShowParticipants: () => void;
  onShowChat: () => void;
  onShowSettings: () => void;
  onShowHelp: () => void;
  activeTab: 'participants' | 'chat' | 'settings' | 'help';
}

const RoomSidebar = ({
  room,
  currentUserId,
  onShowParticipants,
  onShowChat,
  onShowSettings,
  onShowHelp,
  activeTab
}: RoomSidebarProps) => {
  const isHost = room.hostId === currentUserId;

  const formatDuration = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white rounded-lg shadow-sm border flex flex-col h-full"
    >
      {/* Room Info Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Practice Room
            </h2>
            <p className="text-sm text-gray-500">
              {room.roomId}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge
              variant={room.status === 'active' ? 'default' : 'secondary'}
              className={room.status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {room.status === 'active' ? 'Active' : 'Closed'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Participants</span>
            <span className="text-sm font-medium">
              {room.participantCount}/{room.maxParticipants}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium">
                {formatDuration(room.createdAt)}
              </span>
            </div>
          </div>

          {isHost && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Host
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <Button
            variant={activeTab === 'participants' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onShowParticipants}
          >
            <Users className="h-4 w-4 mr-3" />
            Participants
            <Badge variant="secondary" className="ml-auto">
              {room.participantCount}
            </Badge>
          </Button>

          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onShowChat}
          >
            <MessageSquare className="h-4 w-4 mr-3" />
            Chat
          </Button>

          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onShowSettings}
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>

          <Button
            variant={activeTab === 'help' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={onShowHelp}
          >
            <HelpCircle className="h-4 w-4 mr-3" />
            Help & Tips
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>

          <Button variant="outline" className="w-full justify-start" size="sm">
            <BookOpen className="h-4 w-4 mr-3" />
            Practice Topics
          </Button>

          <Button variant="outline" className="w-full justify-start" size="sm">
            <Trophy className="h-4 w-4 mr-3" />
            View Progress
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center">
          <p>Room created {new Date(room.createdAt).toLocaleDateString()}</p>
          <p className="mt-1">
            Practice Room v1.0 • Real-time voice chat
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomSidebar;