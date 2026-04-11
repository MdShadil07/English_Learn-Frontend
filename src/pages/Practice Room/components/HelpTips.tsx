import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

const HelpTips = () => {
  const tips = [
    {
      icon: Mic,
      title: "Voice Controls",
      description: "Use the microphone button to mute/unmute yourself. Click the speaker icon to deafen/undeafen.",
      color: "text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Chat Features",
      description: "Send messages to all participants. Use @username to mention someone specifically.",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Participants",
      description: "View who's in the room. The host has special controls like muting others or closing the room.",
      color: "text-purple-600"
    },
    {
      icon: Settings,
      title: "Room Settings",
      description: "Only hosts can change room settings like max participants, privacy, and recording permissions.",
      color: "text-orange-600"
    }
  ];

  const faqs = [
    {
      question: "How do I invite others to join?",
      answer: "Share the Room ID with others. They can join by entering this ID in the practice room section."
    },
    {
      question: "What happens if I lose connection?",
      answer: "The system will automatically try to reconnect you. If reconnection fails, you'll need to rejoin the room."
    },
    {
      question: "Can I record the session?",
      answer: "Recording is only allowed if the room host has enabled it in the room settings."
    },
    {
      question: "How many people can join a room?",
      answer: "Rooms can have 2-50 participants, depending on the host's settings."
    },
    {
      question: "What if someone is being disruptive?",
      answer: "As a host, you can mute individual participants or close the room if needed."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Help & Tips</h3>
      </div>

      {/* Quick Tips */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Quick Tips
        </h4>
        <div className="grid gap-3">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <tip.icon className={`h-5 w-5 mt-0.5 ${tip.color}`} />
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">{tip.title}</h5>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Best Practices */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Best Practices</h4>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900">Be Respectful</h5>
              <p className="text-xs text-blue-700 mt-1">
                Wait for others to finish speaking before you begin. Use the mute button if you're not speaking.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Mic className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-green-900">Test Your Audio</h5>
              <p className="text-xs text-green-700 mt-1">
                Check your microphone and speakers before joining. Use the audio settings to adjust volume.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-purple-900">Stay Engaged</h5>
              <p className="text-xs text-purple-700 mt-1">
                Participate actively in conversations. Use the chat for questions or clarifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* FAQ */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Frequently Asked Questions</h4>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <span className="text-sm">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Support */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Need More Help?</h5>
        <p className="text-xs text-gray-600 mb-3">
          If you encounter technical issues or have questions about using practice rooms,
          contact our support team.
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            support@englishpractice.com
          </Badge>
          <Badge variant="outline" className="text-xs">
            24/7 Chat Support
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpTips;