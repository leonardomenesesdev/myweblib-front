import { useState, useEffect } from "react";

// Hook genérico para atrasar a atualização de um valor
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura o timer para atualizar o valor
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Se o valor mudar antes do delay (usuário digitou de novo),
    // o timer anterior é cancelado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}