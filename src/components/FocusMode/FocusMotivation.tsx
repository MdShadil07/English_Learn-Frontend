import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

interface FocusMotivationProps {
  nativeLanguage?: string;
  isActive: boolean;
}

// A diverse dictionary covering major language families for global support
const QUOTES_DICTIONARY: Record<string, string[]> = {
  en: [
    "Focus is the secret to all great success.",
    "Do what you have to do until you can do what you want to do.",
    "Don't stop when you're tired. Stop when you're done.",
    "The future depends on what you do today."
  ],
  es: [
    "El enfoque es el secreto de todo gran éxito.",
    "Haz lo que tienes que hacer hasta que puedas hacer lo que quieres hacer.",
    "No te detengas cuando estés cansado. Detente cuando hayas terminado.",
    "El futuro depende de lo que hagas hoy."
  ],
  fr: [
    "La concentration est le secret de tout grand succès.",
    "Faites ce que vous devez faire jusqu'à ce que vous puissiez faire ce que vous voulez.",
    "Ne vous arrêtez pas quand vous êtes fatigué. Arrêtez-vous quand vous avez fini.",
    "L'avenir dépend de ce que vous faites aujourd'hui."
  ],
  hi: [
    "ध्यान केंद्रित करना ही हर महान सफलता का रहस्य है।",
    "तब तक वो करो जो तुम्हें करना है, जब तक तुम वो न कर सको जो तुम करना चाहते हो।",
    "थक जाने पर मत रुकें। काम पूरा होने पर रुकें।",
    "भविष्य इस बात पर निर्भर करता है कि आप आज क्या करते हैं।"
  ],
  zh: [
    "专注是所有伟大成功的秘诀。",
    "做你必须做的事，直到你能做你想做的事。",
    "不要在疲倦时停下来。在完成时停下来。",
    "未来取决于你今天做什么。"
  ],
  ja: [
    "集中力こそが、すべての大きな成功の秘訣です。",
    "やりたいことができるようになるまで、やらなければならないことをやりなさい。",
    "疲れた時に立ち止まるな。終わった時に立ち止まれ。",
    "未来はあなたが今日何をするかにかかっています。"
  ],
  ar: [
    "التركيز هو سر كل نجاح عظيم.",
    "افعل ما يجب عليك فعله حتى تتمكن من فعل ما تريد.",
    "لا تتوقف عندما تكون متعبا. توقف عندما تنتهي.",
    "المستقبل يعتمد على ما تفعله اليوم."
  ],
  pt: [
    "O foco é o segredo de todo grande sucesso.",
    "Faça o que tem que fazer até poder fazer o que quer fazer.",
    "Não pare quando estiver cansado. Pare quando terminar.",
    "O futuro depende do que você faz hoje."
  ]
};

// Fallback to English if exact language code isn't found
const getQuotesForLanguage = (languageStr: string) => {
  const langCode = (languageStr || 'en').toLowerCase().substring(0, 2);
  return QUOTES_DICTIONARY[langCode] || QUOTES_DICTIONARY['en'];
};

export const FocusMotivation: React.FC<FocusMotivationProps> = ({ nativeLanguage = 'en', isActive }) => {
  const quotes = getQuotesForLanguage(nativeLanguage);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes every 30 seconds when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, quotes.length]);

  return (
    <div className="flex flex-col items-center xl:items-start justify-center w-full max-w-2xl h-48 sm:h-56">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
        <Quote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <p className="text-2xl sm:text-3xl font-medium leading-tight text-slate-800 dark:text-slate-200">
            "{quotes[quoteIndex]}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
