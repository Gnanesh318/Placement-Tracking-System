const fs = require('fs');

const classes = fs.readFileSync('classes.txt', 'utf8').split('\n').map(c => c.trim()).filter(Boolean);
let css = '';

const colorMap = {
  'slate': { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
  'blue': { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
  'emerald': { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
  'amber': { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
  'purple': { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87' },
  'indigo': { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
  'rose': { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337' },
  'cyan': { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' },
  'teal': { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
  'white': '#ffffff',
  'black': '#000000',
  'transparent': 'transparent'
};

const sizes = { '0': '0px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '4': '1rem', '5': '1.25rem', '6': '1.5rem', '8': '2rem', '10': '2.5rem', '11': '2.75rem', '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem', '32': '8rem', '40': '10rem', '48': '12rem', '64': '16rem', 'full': '100%', 'screen': '100vw', 'auto': 'auto' };

function escapeClass(c) {
  return c.replace(/[:\/\[\]\.]/g, '\\\$&');
}

classes.forEach(c => {
  if (c.startsWith('bg-')) {
    const parts = c.split('-');
    const colorName = parts[1];
    const shade = parts[2];
    if (colorName === 'gradient') return; // ignore gradients here
    if (colorName === 'white' || colorName === 'black' || colorName === 'transparent') {
      css += . { background-color:  !important; }\n;
    } else if (colorMap[colorName] && colorMap[colorName][shade]) {
      css += . { background-color:  !important; }\n;
    }
  } else if (c.startsWith('text-')) {
    const parts = c.split('-');
    if (['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl'].includes(parts[1])) {
      const sizes = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem' };
      css += . { font-size:  !important; }\n;
    } else {
      const colorName = parts[1];
      const shade = parts[2];
      if (colorName === 'white' || colorName === 'black' || colorName === 'transparent') {
        css += . { color:  !important; }\n;
      } else if (colorMap[colorName] && colorMap[colorName][shade]) {
        css += . { color:  !important; }\n;
      } else if (c === 'text-left') css += . { text-align: left !important; }\n;
      else if (c === 'text-center') css += . { text-align: center !important; }\n;
      else if (c === 'text-right') css += . { text-align: right !important; }\n;
    }
  } else if (c.startsWith('p-')) {
    const size = c.substring(2);
    if (sizes[size]) css += . { padding:  !important; }\n;
  } else if (c.startsWith('px-')) {
    const size = c.substring(3);
    if (sizes[size]) css += . { padding-left:  !important; padding-right:  !important; }\n;
  } else if (c.startsWith('py-')) {
    const size = c.substring(3);
    if (sizes[size]) css += . { padding-top:  !important; padding-bottom:  !important; }\n;
  } else if (c.startsWith('pt-') || c.startsWith('pb-') || c.startsWith('pl-') || c.startsWith('pr-')) {
    const dir = { t: 'top', b: 'bottom', l: 'left', r: 'right' }[c[1]];
    const size = c.substring(3);
    if (sizes[size]) css += . { padding-:  !important; }\n;
  } else if (c.startsWith('m-')) {
    const size = c.substring(2);
    if (sizes[size]) css += . { margin:  !important; }\n;
  } else if (c.startsWith('mx-')) {
    const size = c.substring(3);
    if (sizes[size]) css += . { margin-left:  !important; margin-right:  !important; }\n;
  } else if (c.startsWith('my-')) {
    const size = c.substring(3);
    if (sizes[size]) css += . { margin-top:  !important; margin-bottom:  !important; }\n;
  } else if (c.startsWith('mt-') || c.startsWith('mb-') || c.startsWith('ml-') || c.startsWith('mr-')) {
    const dir = { t: 'top', b: 'bottom', l: 'left', r: 'right' }[c[1]];
    const size = c.substring(3);
    if (sizes[size]) css += . { margin-:  !important; }\n;
  } else if (c.startsWith('-mt-')) {
    const size = c.substring(4);
    if (sizes[size]) css += . { margin-top: - !important; }\n;
  } else if (c.startsWith('w-')) {
    const size = c.substring(2);
    if (sizes[size]) css += . { width:  !important; }\n;
  } else if (c.startsWith('h-')) {
    const size = c.substring(2);
    if (sizes[size]) css += . { height:  !important; }\n;
  } else if (c.startsWith('min-h-')) {
    const size = c.substring(6);
    if (size === 'screen') css += . { min-height: 100vh !important; }\n;
    else if (sizes[size]) css += . { min-height:  !important; }\n;
  } else if (c.startsWith('max-w-')) {
    const size = c.substring(6);
    const mws = { 'xs': '20rem', 'sm': '24rem', 'md': '28rem', 'lg': '32rem', 'xl': '36rem', '2xl': '42rem', '3xl': '48xl', '4xl': '56rem', '5xl': '64rem' };
    if (mws[size]) css += . { max-width:  !important; }\n;
  } else if (c.startsWith('flex')) {
    if (c === 'flex') css += . { display: flex !important; }\n;
    else if (c === 'flex-1') css += . { flex: 1 1 0% !important; }\n;
    else if (c === 'flex-col') css += . { flex-direction: column !important; }\n;
    else if (c === 'flex-row') css += . { flex-direction: row !important; }\n;
    else if (c === 'flex-wrap') css += . { flex-wrap: wrap !important; }\n;
    else if (c === 'flex-shrink-0') css += . { flex-shrink: 0 !important; }\n;
  } else if (c === 'grid') css += . { display: grid !important; }\n;
  else if (c.startsWith('gap-')) {
    const size = c.substring(4);
    if (sizes[size]) css += . { gap:  !important; }\n;
  } else if (c.startsWith('rounded')) {
    if (c === 'rounded') css += . { border-radius: 0.25rem !important; }\n;
    else if (c === 'rounded-sm') css += . { border-radius: 0.125rem !important; }\n;
    else if (c === 'rounded-md') css += . { border-radius: 0.375rem !important; }\n;
    else if (c === 'rounded-lg') css += . { border-radius: 0.5rem !important; }\n;
    else if (c === 'rounded-xl') css += . { border-radius: 0.75rem !important; }\n;
    else if (c === 'rounded-2xl') css += . { border-radius: 1rem !important; }\n;
    else if (c === 'rounded-3xl') css += . { border-radius: 1.5rem !important; }\n;
    else if (c === 'rounded-full') css += . { border-radius: 9999px !important; }\n;
  } else if (c.startsWith('shadow')) {
    if (c === 'shadow-sm') css += . { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }\n;
    else if (c === 'shadow') css += . { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important; }\n;
    else if (c === 'shadow-md') css += . { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }\n;
    else if (c === 'shadow-lg') css += . { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }\n;
    else if (c === 'shadow-xl') css += . { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }\n;
    else if (c === 'shadow-2xl') css += . { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }\n;
    else if (c === 'shadow-inner') css += . { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) !important; }\n;
    else if (c === 'shadow-none') css += . { box-shadow: none !important; }\n;
  } else if (c.startsWith('border')) {
    if (c === 'border') css += . { border-width: 1px !important; }\n;
    else if (c === 'border-2') css += . { border-width: 2px !important; }\n;
    else if (c === 'border-4') css += . { border-width: 4px !important; }\n;
    else if (c === 'border-t') css += . { border-top-width: 1px !important; }\n;
    else if (c === 'border-b') css += . { border-bottom-width: 1px !important; }\n;
    else if (c === 'border-l') css += . { border-left-width: 1px !important; }\n;
    else if (c === 'border-r') css += . { border-right-width: 1px !important; }\n;
    else if (c === 'border-none') css += . { border-style: none !important; }\n;
    else if (c === 'border-solid') css += . { border-style: solid !important; }\n;
    else if (c === 'border-dashed') css += . { border-style: dashed !important; }\n;
    else if (c === 'border-transparent') css += . { border-color: transparent !important; }\n;
    else if (c.split('-').length >= 2) {
      const colorName = c.split('-')[1];
      const shade = c.split('-')[2];
      if (colorMap[colorName] && colorMap[colorName][shade]) {
        css += . { border-color:  !important; }\n;
      }
    }
  } else if (c.startsWith('font-')) {
    const w = { thin: 100, extralight: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
    const weight = c.substring(5);
    if (w[weight]) css += . { font-weight:  !important; }\n;
  }
});

fs.writeFileSync('generated_utils.css', css);
