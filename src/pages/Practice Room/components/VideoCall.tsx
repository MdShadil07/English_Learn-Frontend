import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Minimize,
  Monitor,
  MonitorOff
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { roomService, PeerConnection, RoomParticipant } from '../../../services/roomService';
import { cn } from '../../../lib/utils';

interface VideoCallProps {
  roomId: string;
  participants: RoomParticipant[];
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onEndCall?: () => void;
}

interface VideoTileProps {
  userId: string;
  stream?: MediaStream;
  participant?: RoomParticipant;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  className?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({
  userId,
  stream,
  participant,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card className={cn("relative overflow-hidden bg-gray-900 border-gray-700", className)}>
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent feedback
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Avatar className="w-16 h-16">
            <AvatarImage src={participant?.avatar} />
            <AvatarFallback className="text-lg">
              {participant?.fullName?.charAt(0) || participant?.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* User info overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium truncate">
            {participant?.fullName || participant?.username || 'Unknown'}
            {isLocal && ' (You)'}
          </span>
          {participant?.isHost && (
            <Badge variant="secondary" className="text-xs">
              Host
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isMuted && <MicOff className="w-4 h-4 text-red-500" />}
          {isVideoOff && <VideoOff className="w-4 h-4 text-red-500" />}
        </div>
      </div>
    </Card>
  );
};

const VideoCall: React.FC<VideoCallProps> = ({
  roomId,
  participants,
  isMinimized = false,
  onToggleMinimize,
  onEndCall
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [peerConnections, setPeerConnections] = useState<Map<string, PeerConnection>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Initialize call
  useEffect(() => {
    if (isMinimized || !roomId) return;

    let isMounted = true;

    const initializeCall = async () => {
      try {
        // Initialize media
        const stream = await roomService.initializeMedia(true, isVideoOn);
        if (isMounted) {
          setLocalStream(stream);
        }

        // Join call
        await roomService.joinCall(roomId);
        if (isMounted) {
          setIsInCall(true);
        }
      } catch (error) {
        console.error('Failed to initialize call:', error);
      }
    };

    const unsubscribeOffer = roomService.onWebRTCOffer(handleOffer);
    const unsubscribeAnswer = roomService.onWebRTCAnswer(handleAnswer);
    const unsubscribeIce = roomService.onWebRTCIceCandidate(handleIceCandidate);
    const unsubscribeUserJoined = roomService.onWebRTCUserJoinedCall(handleUserJoinedCall);
    const unsubscribeUserLeft = roomService.onWebRTCUserLeftCall(handleUserLeftCall);
    const unsubscribePeers = roomService.onPeerConnectionsUpdated((connections) => {
      setPeerConnections(new Map(connections));
    });

    initializeCall();

    return () => {
      isMounted = false;
      unsubscribeOffer();
      unsubscribeAnswer();
      unsubscribeIce();
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribePeers();
      roomService.leaveCall(roomId).catch(() => undefined);
      roomService.stopMedia();
      setIsInCall(false);
      setLocalStream(null);
    };
  }, [roomId, isMinimized]);

  const handleOffer = async (data: { roomId: string; fromUserId: string; offer: RTCSessionDescriptionInit }) => {
    try {
      await roomService.handleOffer(data);
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async (data: { roomId: string; fromUserId: string; answer: RTCSessionDescriptionInit }) => {
    try {
      await roomService.handleAnswer(data);
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleIceCandidate = async (data: { roomId: string; fromUserId: string; candidate: RTCIceCandidateInit }) => {
    try {
      await roomService.handleIceCandidate(data);
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  };

  const handleUserJoinedCall = (data: { roomId: string; userId: string; existingParticipants?: string[] }) => {
    if (data.roomId === roomId) {
      const currentUserId = roomService.getCurrentUserId();
      if (data.userId && data.userId !== currentUserId) {
        roomService.sendOffer(data.userId, roomId).catch((error) => {
          console.error('Failed to send offer to joined participant:', error);
        });
      }
    }
  };

  const handleUserLeftCall = (data: { roomId: string; userId: string; reason?: string }) => {
    // Peer connection cleanup is handled in roomService
    if (data.roomId === roomId) {
      setPeerConnections(new Map(roomService.getAllPeerConnections()));
    }
  };

  const toggleMic = () => {
    const newState = roomService.toggleAudio();
    setIsMicOn(newState);
  };

  const toggleVideo = async () => {
    try {
      const enabled = await roomService.toggleVideo();
      setIsVideoOn(enabled);

      if (enabled && !localStream) {
        const stream = roomService.getLocalStream();
        if (stream) {
          setLocalStream(stream);
        }
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
      setIsVideoOn(false);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        setScreenStream(stream);
        setIsScreenSharing(true);

        // Handle screen share stop
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
        };
      } else {
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
    }
  };

  const endCall = async () => {
    try {
      await roomService.leaveCall(roomId);
      roomService.stopMedia();
      setIsInCall(false);
      setLocalStream(null);
      setScreenStream(null);
      setIsScreenSharing(false);
      onEndCall?.();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 bg-gray-900 border-gray-700 cursor-pointer" onClick={onToggleMinimize}>
          <div className="p-3 flex items-center gap-3">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant) => (
                <Avatar key={participant.userId} className="w-8 h-8 border-2 border-gray-900">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">
                    {participant.fullName?.charAt(0) || participant.username?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs text-white">+{participants.length - 3}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">In Call</p>
              <p className="text-gray-400 text-xs">{participants.length} participants</p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                endCall();
              }}
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const activeStreams = Array.from(peerConnections.values()).filter(peer => peer.stream);
  const gridCols = Math.min(activeStreams.length + 1, 4); // Max 4 columns
  const gridRows = Math.ceil((activeStreams.length + 1) / gridCols);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-6xl h-full max-h-[80vh] bg-gray-900 border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {participants.slice(0, 5).map((participant) => (
                  <Avatar key={participant.userId} className="w-8 h-8 border-2 border-gray-900">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-xs">
                      {participant.fullName?.charAt(0) || participant.username?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participants.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-xs text-white">+{participants.length - 5}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-medium">Video Call</h3>
                <p className="text-gray-400 text-sm">{participants.length} participants</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleMinimize}
                className="text-gray-400 hover:text-white"
              >
                <Minimize className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4 overflow-hidden">
            <div
              className="grid gap-4 h-full"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gridTemplateRows: `repeat(${gridRows}, 1fr)`
              }}
            >
              {/* Local video */}
              <VideoTile
                userId="local"
                stream={isScreenSharing ? screenStream || localStream : localStream}
                isLocal={true}
                isMuted={!isMicOn}
                isVideoOff={!isVideoOn && !isScreenSharing}
                className="min-h-[200px]"
              />

              {/* Remote videos */}
              {activeStreams.map((peer) => {
                const participant = participants.find(p => p.userId === peer.userId);
                return (
                  <VideoTile
                    key={peer.userId}
                    userId={peer.userId}
                    stream={peer.stream}
                    participant={participant}
                    className="min-h-[200px]"
                  />
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4">
              {/* Microphone */}
              <Button
                size="lg"
                variant={isMicOn ? "secondary" : "destructive"}
                onClick={toggleMic}
                className="rounded-full w-12 h-12"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {/* Video */}
              <Button
                size="lg"
                variant={isVideoOn ? "secondary" : "outline"}
                onClick={toggleVideo}
                className="rounded-full w-12 h-12"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                onClick={toggleScreenShare}
                className="rounded-full w-12 h-12"
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </Button>

              {/* End Call */}
              <Button
                size="lg"
                variant="destructive"
                onClick={endCall}
                className="rounded-full w-12 h-12"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
