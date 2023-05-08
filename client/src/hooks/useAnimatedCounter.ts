import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export const useAnimatedCounter = (
  maxValue: number,
  initialValue = 0,
  duration = 2,
  delay = 0
) => {
  const [counter, setCounter] = useState<number>(initialValue);

  useEffect(() => {
    const controls = animate(initialValue, maxValue, {
      duration,
      onUpdate(value) {
        setCounter(Math.round(value));
      },
      delay
    });
    return () => controls.stop();
  }, [initialValue, maxValue, duration, delay]);

  return counter;
}