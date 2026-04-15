import { useState, useEffect } from "react";

// Hook này sẽ trì hoãn việc cập nhật giá trị cho đến khi người dùng ngừng gõ sau 1 khoảng thời gian (delay)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt một bộ đếm thời gian
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}