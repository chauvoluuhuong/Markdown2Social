import { CHAR_MAP } from '../constants';
import { StyleType, FontTheme } from '../types';

const convertChar = (char: string, type: StyleType): string => {
  if (type === StyleType.Strikethrough) {
    // @ts-ignore - Strikethrough in CHAR_MAP is a function
    return CHAR_MAP[StyleType.Strikethrough](char);
  }

  const normalIndex = CHAR_MAP[StyleType.Normal].indexOf(char);
  if (normalIndex === -1) return char; // Return original if not mapped (e.g. punctuation)

  // Specific fix: simple italic numbers often lack full unicode support in some fonts/sets,
  // allowing them to remain normal guarantees readability.
  if ((type === StyleType.Italic || type === StyleType.ItalicSans) && /[0-9]/.test(char)) return char;

  // @ts-ignore - We know mapped arrays exist for these types
  return CHAR_MAP[type][normalIndex] || char;
};

/**
 * Converts a string to the target style, preserving emoji sequences and handling Vietnamese characters.
 */
export const convertString = (text: string, type: StyleType): string => {
  // 1. Normalize to NFD (Decomposition)
  // This splits characters like "ê" into "e" + "^". 
  // This allows us to bold the "e" base character so the word looks mostly bold, 
  // rather than having "thin" letters scattered throughout.
  const normalized = text.normalize('NFD');
  const chars = [...normalized]; // Spread into array to handle surrogate pairs correctly
  let res = "";

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const next = chars[i + 1];

    // Emoji Keycap Sequence Detection (e.g., 2️⃣)
    if (/[0-9#*]/.test(char) && next && /[\uFE0F\u20E3]/.test(next)) {
      res += char;
      continue;
    }

    // Vietnamese Correction:
    // If a character is followed by a combining diacritic (U+0300-U+036F),
    // do NOT convert it to a mathematical symbol. 
    // Mathematical symbols (like 𝐢) often render poorly with combining marks (like acute accent).
    // We skip this check for Strikethrough as it uses combining marks intentionally.
    if (type !== StyleType.Strikethrough && next && /[\u0300-\u036f]/.test(next)) {
      res += char;
      continue;
    }

    // Note: We previously attempted to handle đ/Đ with combining strokes (U+0335),
    // but this causes rendering artifacts (misaligned strokes) on many devices.
    // We now allow đ/Đ to pass through as normal characters to ensure correct formatting.

    res += convertChar(char, type);
  }
  return res;
};

export const convertMarkdownToSocial = (input: string, theme: FontTheme = FontTheme.Sans): string => {
  let res = input;

  // Determine styles based on theme
  const boldStyle = theme === FontTheme.Sans ? StyleType.BoldSans : StyleType.Bold;
  const italicStyle = theme === FontTheme.Sans ? StyleType.ItalicSans : StyleType.Italic;
  const boldItalicStyle = theme === FontTheme.Sans ? StyleType.BoldItalicSans : StyleType.BoldItalic;

  // 1. Code Blocks (```code```) -> Monospace
  res = res.replace(/```([\s\S]*?)```/g, (_, p1) => {
    return convertString(p1, StyleType.Monospace);
  });

  // 2. Inline Code (`code`) -> Monospace
  res = res.replace(/`([^`]+)`/g, (_, p1) => {
    return convertString(p1, StyleType.Monospace);
  });

  // 3. Bold Italic (***text*** or ___text___)
  res = res.replace(/(\*\*\*|___)(.*?)\1/g, (_, __, p2) => {
    return convertString(p2, boldItalicStyle);
  });

  // 4. Bold (**text** or __text__)
  res = res.replace(/(\*\*|__)(.*?)\1/g, (_, __, p2) => {
    return convertString(p2, boldStyle);
  });

  // 5. Italic (*text* or _text_)
  res = res.replace(/(\*|_)(.*?)\1/g, (_, __, p2) => {
    return convertString(p2, italicStyle);
  });

  // 6. Strikethrough (~~text~~)
  res = res.replace(/~~(.*?)~~/g, (_, p1) => {
    return convertString(p1, StyleType.Strikethrough);
  });

  // 7. Headers (# Header)
  // Handles # through ######
  res = res.replace(/^(#{1,6})\s+(.*)$/gm, (_, hashes, content) => {
    // Clean internal markdown markers from the header title before bolding to avoid artifacts
    const cleanContent = content.replace(/(\*\*|__)/g, "");
    const converted = convertString(cleanContent, boldStyle);
    
    return converted;
  });

  // 8. Unordered Lists (- item or * item)
  res = res.replace(/^[\*\-]\s+(.*)$/gm, "• $1");

  // 9. Blockquotes (> text)
  res = res.replace(/^>\s+(.*)$/gm, "▎ $1");

  // 10. Horizontal Rules (---)
  res = res.replace(/^---$/gm, "━━━━━━━━━━━━━━━━━━");

  return res;
};