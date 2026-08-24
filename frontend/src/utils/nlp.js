// Parses a voice transcript into a structured command
// Returns: { action, name, quantity, unit } or null if unparseable

const QUANTITY_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1, half: 0.5,
};

const UNITS = ['kg', 'g', 'lb', 'lbs', 'oz', 'litre', 'liter', 'l', 'ml',
  'bottle', 'bottles', 'box', 'boxes', 'can', 'cans', 'pack', 'packs', 'dozen', 'bag', 'bags'];

const ADD_PATTERNS = [
  /^(?:add|i need|i want|get|buy|put|pick up|purchase|grab)\s+/i,
  /^(?:add|please add|do add)\s+/i,
  /^(?:मुझे|मुझे चाहिए|लाओ|खरीदो)\s+/i, // Hindi patterns
];

const REMOVE_PATTERNS = [
  /^(?:remove|delete|take off|cancel|drop)\s+/i,
  /^(?:हटाओ|निकालो)\s+/i,
];

const CHECK_PATTERNS = [/^(?:check|tick|mark|done|got)\s+/i];
const CLEAR_PATTERNS = [/^(?:clear|clear all|empty|reset)\s*(?:the\s*)?(?:list)?$/i];
const SEARCH_PATTERNS = [/^(?:find|search|look for|show me|search for)\s+/i];

function matchAction(text, patterns) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return text.slice(m[0].length).trim();
  }
  return null;
}

function parseQuantity(text) {
  let quantity = 1;
  let unit = '';
  let name = text;

  // Match "2 kg of milk" or "two bottles of juice"
  const numericMatch = text.match(/^(\d+(?:\.\d+)?)\s*/);
  if (numericMatch) {
    quantity = parseFloat(numericMatch[1]);
    name = text.slice(numericMatch[0].length);
  } else {
    for (const [word, val] of Object.entries(QUANTITY_WORDS)) {
      const re = new RegExp(`^${word}\\s+`, 'i');
      if (re.test(text)) {
        quantity = val;
        name = text.replace(re, '');
        break;
      }
    }
  }

  // Match unit
  for (const u of UNITS) {
    const re = new RegExp(`^${u}s?\\s+(?:of\\s+)?`, 'i');
    if (re.test(name)) {
      unit = u;
      name = name.replace(re, '');
      break;
    }
  }

  // Strip leading "of"
  name = name.replace(/^of\s+/i, '').trim();

  return { quantity, unit, name };
}

// Split a string on " and " and "," into individual item strings
function splitItems(text) {
  return text
    .split(/\s+and\s+|,\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function parseCommand(transcript) {
  const text = transcript.trim();

  if (CLEAR_PATTERNS.some((p) => p.test(text))) return { action: 'clear' };

  const searchRest = matchAction(text, SEARCH_PATTERNS);
  if (searchRest !== null) return { action: 'search', query: searchRest };

  const removeRest = matchAction(text, REMOVE_PATTERNS);
  if (removeRest !== null) return { action: 'remove', name: removeRest };

  const checkRest = matchAction(text, CHECK_PATTERNS);
  if (checkRest !== null) return { action: 'check', name: checkRest };

  const addRest = matchAction(text, ADD_PATTERNS);
  if (addRest !== null) {
    // Check if it's a multi-item command
    const parts = splitItems(addRest);
    if (parts.length > 1) {
      return { action: 'add_multiple', items: parts.map((p) => parseQuantity(p)) };
    }
    const parsed = parseQuantity(addRest);
    return { action: 'add', ...parsed };
  }

  // Fallback: treat raw transcript as "add" (or add_multiple if "and"/"," present)
  const fallbackParts = splitItems(text);
  if (fallbackParts.length > 1) {
    return { action: 'add_multiple', items: fallbackParts.map((p) => parseQuantity(p)) };
  }
  const parsed = parseQuantity(text);
  if (parsed.name.length > 1) return { action: 'add', ...parsed };

  return null;
}

// Parse a plain text string (e.g. from the text form) into multiple item objects
export function parseMultipleItems(text) {
  const parts = splitItems(text);
  return parts.map((p) => parseQuantity(p)).filter((p) => p.name.length > 0);
}

export function formatQuantity(quantity, unit) {
  if (!unit) return quantity === 1 ? '' : `${quantity}x`;
  return `${quantity} ${unit}`;
}
