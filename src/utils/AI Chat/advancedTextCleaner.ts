/**
 * Advanced Text Cleaner for Text-to-Speech
 * Handles emojis, special symbols, markdown, and language-specific cleaning
 */

// Comprehensive emoji-to-text mapping
const EMOJI_MAP: Record<string, string> = {
  // Smileys & Emotion
  '😀': 'grinning face',
  '😃': 'grinning face with big eyes',
  '😄': 'grinning face with smiling eyes',
  '😁': 'beaming face with smiling eyes',
  '😆': 'grinning squinting face',
  '😅': 'grinning face with sweat',
  '🤣': 'rolling on the floor laughing',
  '😂': 'face with tears of joy',
  '🙂': 'slightly smiling face',
  '🙃': 'upside down face',
  '😉': 'winking face',
  '😊': 'smiling face with smiling eyes',
  '😇': 'smiling face with halo',
  '🥰': 'smiling face with hearts',
  '😍': 'smiling face with heart eyes',
  '🤩': 'star struck',
  '😘': 'face blowing a kiss',
  '😗': 'kissing face',
  '😚': 'kissing face with closed eyes',
  '😙': 'kissing face with smiling eyes',
  '😋': 'face savoring food',
  '😛': 'face with tongue',
  '😜': 'winking face with tongue',
  '🤪': 'zany face',
  '😝': 'squinting face with tongue',
  '🤑': 'money mouth face',
  '🤗': 'hugging face',
  '🤭': 'face with hand over mouth',
  '🤫': 'shushing face',
  '🤔': 'thinking face',
  '🤐': 'zipper mouth face',
  '🤨': 'face with raised eyebrow',
  '😐': 'neutral face',
  '😑': 'expressionless face',
  '😶': 'face without mouth',
  '😏': 'smirking face',
  '😒': 'unamused face',
  '🙄': 'face with rolling eyes',
  '😬': 'grimacing face',
  '🤥': 'lying face',
  '😌': 'relieved face',
  '😔': 'pensive face',
  '😪': 'sleepy face',
  '🤤': 'drooling face',
  '😴': 'sleeping face',
  '😷': 'face with medical mask',
  '🤒': 'face with thermometer',
  '🤕': 'face with head bandage',
  '🤢': 'nauseated face',
  '🤮': 'face vomiting',
  '🤧': 'sneezing face',
  '🥵': 'hot face',
  '🥶': 'cold face',
  '😵': 'dizzy face',
  '🤯': 'exploding head',
  '🤠': 'cowboy hat face',
  '🥳': 'partying face',
  '😎': 'smiling face with sunglasses',
  '🤓': 'nerd face',
  '🧐': 'face with monocle',
  '😕': 'confused face',
  '😟': 'worried face',
  '🙁': 'slightly frowning face',
  '😮': 'face with open mouth',
  '😯': 'hushed face',
  '😲': 'astonished face',
  '😳': 'flushed face',
  '🥺': 'pleading face',
  '😦': 'frowning face with open mouth',
  '😧': 'anguished face',
  '😨': 'fearful face',
  '😰': 'anxious face with sweat',
  '😥': 'sad but relieved face',
  '😢': 'crying face',
  '😭': 'loudly crying face',
  '😱': 'face screaming in fear',
  '😖': 'confounded face',
  '😣': 'persevering face',
  '😞': 'disappointed face',
  '😓': 'downcast face with sweat',
  '😩': 'weary face',
  '😫': 'tired face',
  '🥱': 'yawning face',
  '😤': 'face with steam from nose',
  '😡': 'pouting face',
  '😠': 'angry face',
  '🤬': 'face with symbols on mouth',
  '😈': 'smiling face with horns',
  '👿': 'angry face with horns',
  '💀': 'skull',
  '💩': 'pile of poo',
  '👻': 'ghost',
  '👽': 'alien',
  '🤖': 'robot',
  
  // Hand gestures
  '👍': 'thumbs up',
  '👎': 'thumbs down',
  '👌': 'OK hand',
  '✌️': 'victory hand',
  '🤞': 'crossed fingers',
  '🤟': 'love you gesture',
  '🤘': 'sign of the horns',
  '🤙': 'call me hand',
  '👈': 'backhand index pointing left',
  '👉': 'backhand index pointing right',
  '👆': 'backhand index pointing up',
  '👇': 'backhand index pointing down',
  '☝️': 'index pointing up',
  '✋': 'raised hand',
  '🤚': 'raised back of hand',
  '🖐️': 'hand with fingers splayed',
  '🖖': 'vulcan salute',
  '👋': 'waving hand',
  '🤝': 'handshake',
  '🙏': 'folded hands',
  '✍️': 'writing hand',
  '💪': 'flexed biceps',
  '👏': 'clapping hands',
  '🙌': 'raising hands',
  
  // Hearts & Love
  '❤️': 'red heart',
  '🧡': 'orange heart',
  '💛': 'yellow heart',
  '💚': 'green heart',
  '💙': 'blue heart',
  '💜': 'purple heart',
  '🖤': 'black heart',
  '🤍': 'white heart',
  '🤎': 'brown heart',
  '💔': 'broken heart',
  '❣️': 'heart exclamation',
  '💕': 'two hearts',
  '💞': 'revolving hearts',
  '💓': 'beating heart',
  '💗': 'growing heart',
  '💖': 'sparkling heart',
  '💘': 'heart with arrow',
  '💝': 'heart with ribbon',
  
  // Common objects
  '⭐': 'star',
  '✨': 'sparkles',
  '💫': 'dizzy',
  '🔥': 'fire',
  '💧': 'droplet',
  '💦': 'sweat droplets',
  '☀️': 'sun',
  '🌙': 'crescent moon',
  '⚡': 'lightning',
  '🌈': 'rainbow',
  '☁️': 'cloud',
  '❄️': 'snowflake',
  '⛄': 'snowman',
  '🎄': 'Christmas tree',
  '🎁': 'wrapped gift',
  '🎂': 'birthday cake',
  '🎉': 'party popper',
  '🎊': 'confetti ball',
  '🎈': 'balloon',
  '🏆': 'trophy',
  '🥇': 'gold medal',
  '🥈': 'silver medal',
  '🥉': 'bronze medal',
  '⚽': 'soccer ball',
  '🏀': 'basketball',
  '🏈': 'football',
  '⚾': 'baseball',
  '🎾': 'tennis',
  '🏐': 'volleyball',
  '🎯': 'direct hit',
  '🎮': 'video game',
  '🎲': 'game die',
  '🎭': 'performing arts',
  '🎨': 'artist palette',
  '🎬': 'clapper board',
  '🎤': 'microphone',
  '🎧': 'headphone',
  '🎵': 'musical note',
  '🎶': 'musical notes',
  '📱': 'mobile phone',
  '💻': 'laptop',
  '⌨️': 'keyboard',
  '🖱️': 'computer mouse',
  '📚': 'books',
  '📖': 'open book',
  '📝': 'memo',
  '📄': 'page facing up',
  '✅': 'check mark',
  '❌': 'cross mark',
  '⚠️': 'warning',
  '🚫': 'prohibited',
  '💯': 'hundred points',
  '🔔': 'bell',
  '🔕': 'bell with slash',
  '📢': 'loudspeaker',
  '📣': 'megaphone',
  '💬': 'speech balloon',
  '💭': 'thought balloon',
  '🗨️': 'left speech bubble',
  '🔍': 'magnifying glass',
  '🔎': 'magnifying glass tilted right',
  '🔑': 'key',
  '🔒': 'locked',
  '🔓': 'unlocked',
  '🔧': 'wrench',
  '⚙️': 'gear',
  '🔨': 'hammer',
  '💡': 'light bulb',
  '💰': 'money bag',
  '💵': 'dollar bill',
  '💳': 'credit card',
  '🎓': 'graduation cap',
  '📍': 'round pushpin',
  '🌍': 'globe showing Europe-Africa',
  '🌎': 'globe showing Americas',
  '🌏': 'globe showing Asia-Australia',
  '🗺️': 'world map',
  '🏠': 'house',
  '🏢': 'office building',
  '🏫': 'school',
  '🏥': 'hospital',
  '🚗': 'car',
  '🚕': 'taxi',
  '🚙': 'sport utility vehicle',
  '🚌': 'bus',
  '🚎': 'trolleybus',
  '🏃': 'person running',
  '🚶': 'person walking',
  '💃': 'woman dancing',
  '🕺': 'man dancing',
  
  // Food
  '🍕': 'pizza',
  '🍔': 'hamburger',
  '🍟': 'french fries',
  '🌭': 'hot dog',
  '🍿': 'popcorn',
  '🥗': 'green salad',
  '🍎': 'red apple',
  '🍊': 'tangerine',
  '🍋': 'lemon',
  '🍌': 'banana',
  '🍉': 'watermelon',
  '🍇': 'grapes',
  '🍓': 'strawberry',
  '🍒': 'cherries',
  '🍑': 'peach',
  '🥑': 'avocado',
  '🍆': 'eggplant',
  '🥕': 'carrot',
  '🌽': 'ear of corn',
  '🍞': 'bread',
  '🥐': 'croissant',
  '🥖': 'baguette bread',
  '🧀': 'cheese wedge',
  '🥚': 'egg',
  '🍳': 'cooking',
  '🥓': 'bacon',
  '🥞': 'pancakes',
  '🍗': 'poultry leg',
  '🍖': 'meat on bone',
  '🌮': 'taco',
  '🌯': 'burrito',
  '🥙': 'stuffed flatbread',
  '🍝': 'spaghetti',
  '🍜': 'steaming bowl',
  '🍲': 'pot of food',
  '🍛': 'curry rice',
  '🍣': 'sushi',
  '🍱': 'bento box',
  '🥟': 'dumpling',
  '🍦': 'soft ice cream',
  '🍧': 'shaved ice',
  '🍨': 'ice cream',
  '🍩': 'doughnut',
  '🍪': 'cookie',
  '🍰': 'shortcake',
  '🧁': 'cupcake',
  '🥧': 'pie',
  '🍫': 'chocolate bar',
  '🍬': 'candy',
  '🍭': 'lollipop',
  '🍮': 'custard',
  '☕': 'hot beverage',
  '🍵': 'teacup without handle',
  '🥤': 'cup with straw',
  '🍶': 'sake',
  '🍺': 'beer mug',
  '🍻': 'clinking beer mugs',
  '🥂': 'clinking glasses',
  '🍷': 'wine glass',
  '🥃': 'tumbler glass',
  '🍸': 'cocktail glass',
  '🍹': 'tropical drink',
};

/**
 * Language-specific voice BCP-47 codes
 */
export const LANGUAGE_VOICE_CODES: Record<string, string[]> = {
  english: ['en-US', 'en-GB', 'en-AU', 'en-IN', 'en-CA'],
  hindi: ['hi-IN'],
  spanish: ['es-ES', 'es-MX', 'es-AR', 'es-US'],
  french: ['fr-FR', 'fr-CA', 'fr-BE'],
  german: ['de-DE', 'de-AT', 'de-CH'],
  chinese: ['zh-CN', 'zh-TW', 'zh-HK'],
  japanese: ['ja-JP'],
  korean: ['ko-KR'],
  arabic: ['ar-SA', 'ar-EG', 'ar-AE'],
  portuguese: ['pt-BR', 'pt-PT'],
  russian: ['ru-RU'],
  italian: ['it-IT'],
  dutch: ['nl-NL', 'nl-BE'],
  turkish: ['tr-TR'],
  polish: ['pl-PL'],
  vietnamese: ['vi-VN'],
  thai: ['th-TH'],
  indonesian: ['id-ID'],
  bengali: ['bn-IN', 'bn-BD'],
  urdu: ['ur-PK', 'ur-IN'],
};

/**
 * Convert emoji to spoken text
 * Uses regex to match only actual emoji characters, not regular text
 */
export function emojiToText(text: string): string {
  let result = text;
  
  // Replace emojis with their spoken equivalents
  // Use global replace with proper escaping to avoid corrupting non-emoji text
  for (const [emoji, spoken] of Object.entries(EMOJI_MAP)) {
    // Escape special regex characters and use global flag
    const escapedEmoji = emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedEmoji, 'g');
    result = result.replace(regex, ` ${spoken} `);
  }
  
  return result;
}

/**
 * Clean markdown and special formatting
 */
export function cleanMarkdown(text: string): string {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, ' code block ')
    .replace(/`([^`]+)`/g, '$1')
    
    // Remove bold, italic, strikethrough
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    
    // Remove horizontal rules
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, ' separator ')
    
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, 'image: $1')
    
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    
    // Remove special markers (VOCAB_WORD, etc.)
    .replace(/\[VOCAB_WORD:[^\]]+\]/g, '')
    .replace(/\[PHRASE:[^\]]+\]/g, '')
    .replace(/\[GRAMMAR:[^\]]+\]/g, '')
    .replace(/\[EXAMPLE:[^\]]+\]/g, '')
    .replace(/\[TRANSLATION:[^\]]+\]/g, '');
}

/**
 * Clean redundant symbols and patterns
 */
export function cleanRedundantSymbols(text: string): string {
  return text
    // Remove asterisks patterns
    .replace(/\*{2,}/g, '')
    .replace(/\*+/g, ' ')
    
    // Remove dashes patterns
    .replace(/-{3,}/g, ' ')
    
    // Remove underscores patterns
    .replace(/_{2,}/g, '')
    
    // Remove equals patterns
    .replace(/={2,}/g, ' ')
    
    // Remove plus patterns
    .replace(/\+{2,}/g, '')
    
    // Remove hashtag patterns
    .replace(/#{2,}/g, '')
    
    // Remove pipe patterns
    .replace(/\|{2,}/g, '')
    
    // Remove dots patterns (but keep ellipsis and periods)
    .replace(/\.{4,}/g, '... ')
    
    // Remove exclamation patterns (but keep single and double)
    .replace(/!{3,}/g, '!! ')
    
    // Remove question patterns (but keep single and double)
    .replace(/\?{3,}/g, '?? ')
    
    // Remove parentheses/brackets with only symbols
    .replace(/[([{][*\-_=+#|.!?\s]+[\])}]/g, '')
    
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/www\.[^\s]+/g, '')
    
    // Remove email addresses
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, 'email address');
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    
    // Replace multiple newlines with single space
    .replace(/\n+/g, ' ')
    
    // Trim leading and trailing whitespace
    .trim();
}

/**
 * Add pauses for better speech rhythm
 */
export function addSpeechPauses(text: string): string {
  return text
    // Add pause after sentences
    .replace(/([.!?])\s+/g, '$1. ')
    
    // Add pause after commas
    .replace(/,\s+/g, ', ')
    
    // Add pause after colons
    .replace(/:\s+/g, ': ')
    
    // Add pause after semicolons
    .replace(/;\s+/g, '; ');
}

/**
 * Convert numbers to words for better pronunciation
 */
export function numbersToWords(text: string): string {
  const numberWords: Record<string, string> = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '10': 'ten',
  };
  
  // Convert single digits
  return text.replace(/\b(\d)\b/g, (match, num) => numberWords[num] || match);
}

/**
 * Clean special characters for speech
 */
export function cleanSpecialCharacters(text: string): string {
  return text
    // Replace ampersand
    .replace(/&/g, ' and ')
    
    // Replace @ symbol
    .replace(/@/g, ' at ')
    
    // Replace # symbol (not in markdown context)
    .replace(/#(?!\d)/g, ' hash ')
    
    // Replace $ symbol
    .replace(/\$/g, ' dollar ')
    
    // Replace % symbol
    .replace(/%/g, ' percent ')
    
    // Replace ^ symbol
    .replace(/\^/g, ' ')
    
    // Replace ~ symbol
    .replace(/~/g, ' ')
    
    // Remove backticks
    .replace(/`/g, '')
    
    // Replace parenthetical expressions
    .replace(/\(([^)]+)\)/g, ', $1,');
}

/**
 * Master text cleaning function for TTS
 */
export function cleanTextForSpeech(text: string, language: string = 'english'): string {
  let cleanedText = text;
  
  // Step 1: Convert emojis to text
  cleanedText = emojiToText(cleanedText);
  
  // Step 2: Clean markdown
  cleanedText = cleanMarkdown(cleanedText);
  
  // Step 3: Clean redundant symbols
  cleanedText = cleanRedundantSymbols(cleanedText);
  
  // Step 4: Clean special characters
  cleanedText = cleanSpecialCharacters(cleanedText);
  
  // Step 5: Convert numbers to words (optional, for better pronunciation)
  // cleanedText = numbersToWords(cleanedText);
  
  // Step 6: Add speech pauses
  cleanedText = addSpeechPauses(cleanedText);
  
  // Step 7: Normalize whitespace
  cleanedText = normalizeWhitespace(cleanedText);
  
  return cleanedText;
}

/**
 * Get preferred voice codes for a language
 */
export function getVoiceCodesForLanguage(language: string): string[] {
  return LANGUAGE_VOICE_CODES[language.toLowerCase()] || LANGUAGE_VOICE_CODES.english;
}

/**
 * Validate and sanitize text before speech
 */
export function validateTextForSpeech(text: string): { valid: boolean; cleaned: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, cleaned: '', error: 'Invalid text input' };
  }
  
  const cleaned = cleanTextForSpeech(text);
  
  if (cleaned.length === 0) {
    return { valid: false, cleaned: '', error: 'Text is empty after cleaning' };
  }
  
  if (cleaned.length > 5000) {
    return { 
      valid: true, 
      cleaned: cleaned.substring(0, 5000) + '...', 
      error: 'Text truncated to 5000 characters' 
    };
  }
  
  return { valid: true, cleaned };
}
