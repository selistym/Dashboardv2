import { useEffect, useRef, useState } from 'react';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useHighlight(value, classEqual = '', classHigher = 'highlight-up', classLower = 'highlight-down') {
  const [highlightClass, setHighlightClass] = useState();
  const [timeout, setMyTimeout] = useState();
  const currentValue = +value;

  const previousValue = usePrevious(+value);

  useEffect(() => {
    if (previousValue !== currentValue) {
      if (previousValue < currentValue) {
        setHighlightClass(classHigher);
      }
      if (previousValue > currentValue) {
        setHighlightClass(classLower);
      }
      clearInterval(timeout);
      const newTimeout = setTimeout(() => {
        setHighlightClass(classEqual);
      }, 3 * 1000);
      setMyTimeout(newTimeout);
      return () => {
        clearInterval(timeout);
      };
    }
  });

  return highlightClass;
}
