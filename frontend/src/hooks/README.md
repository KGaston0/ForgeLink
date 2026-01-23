# Hooks Directory

This directory contains custom React hooks that encapsulate reusable stateful logic.

## Common Hooks

### Data Fetching
- `useFetch.js` - Generic data fetching hook
- `useApi.js` - API request hook with loading/error states
- `useDebounce.js` - Debounce values for search inputs

### Form Management
- `useForm.js` - Form state management
- `useFormValidation.js` - Form validation logic

### UI/UX
- `useToggle.js` - Boolean state toggling
- `useModal.js` - Modal open/close management
- `useLocalStorage.js` - Sync state with localStorage
- `useSessionStorage.js` - Sync state with sessionStorage
- `useMediaQuery.js` - Responsive design hook
- `useClickOutside.js` - Detect clicks outside element

### Performance
- `useThrottle.js` - Throttle function calls
- `useMemoizedCallback.js` - Memoize callbacks

## Hook Templates

### Generic Fetch Hook

```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};
```

### Local Storage Hook

```javascript
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

### Debounce Hook

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage example:
// const searchTerm = useDebounce(inputValue, 500);
```

### Toggle Hook

```javascript
// hooks/useToggle.js
import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse, setValue }];
};
```

### Media Query Hook

```javascript
// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage:
// const isMobile = useMediaQuery('(max-width: 768px)');
```

### Click Outside Hook

```javascript
// hooks/useClickOutside.js
import { useEffect, useRef } from 'react';

export const useClickOutside = (handler) => {
  const ref = useRef();

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};

// Usage:
// const modalRef = useClickOutside(() => setIsOpen(false));
// <div ref={modalRef}>...</div>
```

## Best Practices

1. **Single Responsibility**: Each hook should do one thing well
2. **Naming Convention**: Use `use` prefix (e.g., `useAuth`, `useFetch`)
3. **Dependencies**: Always include all dependencies in dependency arrays
4. **Cleanup**: Return cleanup functions when needed
5. **TypeScript**: Add proper type definitions if using TS
6. **Testing**: Write unit tests for custom hooks
