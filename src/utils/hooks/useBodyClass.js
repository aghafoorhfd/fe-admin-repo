import { useEffect } from 'react';

const addBodyClass = (className) => document.body.classList.add(className);
const removeBodyClass = (className) => document.body.classList.remove(className);

export default function useBodyClass(className) {
  useEffect(() => {
    // Set up
    // eslint-disable-next-line no-unused-expressions
    className instanceof Array ? className.map(addBodyClass) : addBodyClass(className);

    // Clean up
    return () => {
      // eslint-disable-next-line no-unused-expressions
      className instanceof Array ? className.map(removeBodyClass) : removeBodyClass(className);
    };
  }, [className]);
}
