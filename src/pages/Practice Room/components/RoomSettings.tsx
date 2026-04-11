import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Lock } from 'lucide-react';

import { RoomDetails } from '../../../services/roomService';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '../../../components/ui/separator';
import { Badge } from '../../../components/ui/badge';

interface RoomSettingsProps {
  room: RoomDetails;
  isHost: boolean;
  onClose: () => void;
  onUpdateSettings?: (settings: Partial<RoomDetails>) => void;
}

const RoomSettings = ({ room, isHost, onClose, onUpdateSettings }: RoomSettingsProps) => {
  const [settings, setSettings] = useState({
    maxParticipants: room.maxParticipants,
    isPrivate: room.isPrivate || false,
    allowRecording: room.allowRecording || false,
    description: room.description || '',
    topic: room.topic || ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onUpdateSettings) {
      onUpdateSettings(settings);
    }
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings({
      maxParticipants: room.maxParticipants,
      isPrivate: room.isPrivate || false,
      allowRecording: room.allowRecording || false,
      description: room.description || '',
      topic: room.topic || ''
    });
    setHasChanges(false);
  };

  if (!isHost) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="text-center py-8">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Settings Access Restricted
          </h3>
          <p className="text-gray-600">
            Only the room host can modify room settings.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Room Settings</h3>
            <p className="text-sm text-gray-500">Manage the room details and access settings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Badge variant="outline">Host Only</Badge>
          </div>
        </div>

        <div className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Basic Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="2"
                max="50"
                value={settings.maxParticipants}
                onChange={(e) => handleSettingChange('maxParticipants', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="topic">Room Topic</Label>
              <Input
                id="topic"
                value={settings.topic}
                onChange={(e) => handleSettingChange('topic', e.target.value)}
                placeholder="e.g., Business English Practice"
                className="mt-1"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Room Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              placeholder="Describe what this practice session is about..."
              className="mt-1"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {settings.description.length}/500 characters
            </p>
          </div>
        </div>

        <Separator />

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Privacy & Access</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Private Room</Label>
              <p className="text-xs text-gray-600">
                Only invited participants can join
              </p>
            </div>
            <Switch
              checked={settings.isPrivate}
              onCheckedChange={(checked) => handleSettingChange('isPrivate', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Allow Recording</Label>
              <p className="text-xs text-gray-600">
                Participants can record the session
              </p>
            </div>
            <Switch
              checked={settings.allowRecording}
              onCheckedChange={(checked) => handleSettingChange('allowRecording', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Room Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Room Information</h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Room ID:</span>
              <p className="font-mono text-gray-900">{room.roomId}</p>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <p className="text-gray-900">
                {new Date(room.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Host:</span>
              <p className="text-gray-900">You</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <Badge
                variant={room.status === 'active' ? 'default' : 'secondary'}
                className={room.status === 'active' ? 'bg-green-100 text-green-800' : ''}
              >
                {room.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-4 border-t"
          >
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  </motion.div>
  );
};

export default RoomSettings;