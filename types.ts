export enum StyleType {
  Normal = 'normal',
  Bold = 'bold',
  Italic = 'italic',
  BoldItalic = 'boldItalic',
  Monospace = 'monospace',
  Script = 'script',
  Strikethrough = 'strikethrough',
  // Sans Serif Variants
  BoldSans = 'boldSans',
  ItalicSans = 'italicSans',
  BoldItalicSans = 'boldItalicSans'
}

export enum FontTheme {
  Serif = 'serif',
  Sans = 'sans'
}

export interface CharMap {
  [StyleType.Normal]: string;
  [StyleType.Bold]: string[];
  [StyleType.Italic]: string[];
  [StyleType.BoldItalic]: string[];
  [StyleType.Monospace]: string[];
  [StyleType.Script]: string[];
  [StyleType.Strikethrough]: (char: string) => string;
  [StyleType.BoldSans]: string[];
  [StyleType.ItalicSans]: string[];
  [StyleType.BoldItalicSans]: string[];
}

export enum AiAction {
  Socialify = 'socialify',
  Hashtags = 'hashtags',
  Shorten = 'shorten',
  Expand = 'expand'
}