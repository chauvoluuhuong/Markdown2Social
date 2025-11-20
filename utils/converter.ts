import { CHAR_MAP } from '../constants';
import { StyleType } from '../types';

const convertChar = (char: string, type: StyleType): string => {
  if (type === StyleType.Strikethrough) {
    // @ts-ignore - Strikethrough in CHAR_MAP is a function
    return CHAR_MAP[StyleType.Strikethrough](char);
  }

  const normalIndex = CHAR_MAP[StyleType.Normal].indexOf(char);
  if (normalIndex === -1) return char; // Return original if not mapped (e.g. punctuation)

  // Specific fix: simple italic numbers often lack full unicode support in some fonts/sets,
  // allowing them to remain normal guarantees readability.
  if (type === StyleType.Italic && /[0-9]/.test(char)) return char;

  // @ts-ignore - We know mapped arrays exist for these types
  return CHAR_MAP[type][normalIndex] || char;
};

/**
 * Converts a string to the target style, preserving emoji sequences.
 */
export const convertString = (text: string, type: StyleType): string => {
  const chars = [...text]; // Handle unicode surrogates
  let res = "";

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const next = chars[i + 1];

    // Emoji Keycap Sequence Detection (e.g., 2️⃣)
    // If a number/hash/star is followed by Variation Selector-16 (\uFE0F) or Keycap (\u20E3),
    // we must NOT convert it, otherwise the keycap box breaks.
    if (/[0-9#*]/.test(char) && next && /[\uFE0F\u20E3]/.test(next)) {
      res += char;
      continue;
    }

    res += convertChar(char, type);
  }
  return res;
};

export const convertMarkdownToSocial = (input: string): string => {
  let res = input;

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
    return convertString(p2, StyleType.BoldItalic);
  });

  // 4. Bold (**text** or __text__)
  res = res.replace(/(\*\*|__)(.*?)\1/g, (_, __, p2) => {
    return convertString(p2, StyleType.Bold);
  });

  // 5. Italic (*text* or _text_)
  res = res.replace(/(\*|_)(.*?)\1/g, (_, __, p2) => {
    return convertString(p2, StyleType.Italic);
  });

  // 6. Strikethrough (~~text~~)
  res = res.replace(/~~(.*?)~~/g, (_, p1) => {
    return convertString(p1, StyleType.Strikethrough);
  });

  // 7. Headers (# Header)
  // Handles # through ######
  res = res.replace(/^(#{1,6})\s+(.*)$/gm, (_, hashes, content) => {
    const isMajor = hashes.length <= 2; // # or ##
    // Clean internal markdown markers from the header title before bolding to avoid artifacts
    const cleanContent = content.replace(/(\*\*|__)/g, "");
    const converted = convertString(cleanContent, StyleType.Bold);
    
    // Add a separator line for major headers to simulate a "block"
    if (isMajor) {
      return `${converted}\n━━━━━━━━━━━━━━━━`;
    }
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
