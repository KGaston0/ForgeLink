# Utils Directory

Utility functions and helper methods used across the application.

## Common Utilities

### Date/Time
- `dateFormatter.js` - Format dates consistently
- `timeAgo.js` - Display relative time ("2 hours ago")

### String Manipulation
- `stringHelpers.js` - Capitalize, truncate, slugify
- `validation.js` - Input validation helpers

### Data Transformation
- `arrayHelpers.js` - Array manipulation utilities
- `objectHelpers.js` - Object manipulation utilities

### Formatting
- `formatters.js` - Number, currency, percentage formatters

### Constants
- `constants.js` - App-wide constants

## Utility Examples

### Date Formatter

```javascript
// utils/dateFormatter.js
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  const formats = {
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
  };
  
  return formats[format] || formats['MM/DD/YYYY'];
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};
```

### String Helpers

```javascript
// utils/stringHelpers.js
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const removeHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};
```

### Validation Helpers

```javascript
// utils/validation.js
export const isEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const isUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Array Helpers

```javascript
// utils/arrayHelpers.js
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

export const unique = (array) => {
  return [...new Set(array)];
};

export const uniqueBy = (array, key) => {
  return [...new Map(array.map(item => [item[key], item])).values()];
};
```

### Object Helpers

```javascript
// utils/objectHelpers.js
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
```

### Constants

```javascript
// utils/constants.js
export const NODE_TYPES = {
  CHARACTER: 'character',
  LOCATION: 'location',
  EVENT: 'event',
  ITEM: 'item',
  CONCEPT: 'concept',
  NOTE: 'note',
};

export const NODE_TYPE_LABELS = {
  [NODE_TYPES.CHARACTER]: 'Character',
  [NODE_TYPES.LOCATION]: 'Location',
  [NODE_TYPES.EVENT]: 'Event',
  [NODE_TYPES.ITEM]: 'Item',
  [NODE_TYPES.CONCEPT]: 'Concept',
  [NODE_TYPES.NOTE]: 'Note',
};

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  GRAPHS: '/graphs',
  GRAPH_DETAIL: '/graphs/:id',
  NODES: '/nodes',
  NODE_DETAIL: '/nodes/:id',
};
```

## Best Practices

1. **Pure Functions**: Utilities should be pure (no side effects)
2. **Single Purpose**: Each utility does one thing well
3. **No Dependencies**: Avoid external dependencies when possible
4. **Well Tested**: Write unit tests for all utilities
5. **Type Safety**: Add JSDoc or TypeScript types
6. **Documentation**: Document parameters and return values
