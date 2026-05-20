import { useEffect, useState } from 'react';
import { filterARInput, formatARNumber, parseARNumber } from '../utils';

interface Props {
  value: number;
  onChange: (value: number) => void;
  decimals?: number;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  id?: string;
}

export default function ARNumberInput({
  value,
  onChange,
  decimals = 2,
  placeholder = '0,00',
  className = '',
  readOnly = false,
  id,
}: Props) {
  const [display, setDisplay] = useState(() =>
    value ? formatARNumber(value, decimals) : ''
  );
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplay(value ? formatARNumber(value, decimals) : '');
    }
  }, [value, decimals, focused]);

  const handleChange = (raw: string) => {
    const filtered = filterARInput(raw);
    setDisplay(filtered);
    onChange(parseARNumber(filtered));
  };

  const handleBlur = () => {
    setFocused(false);
    setDisplay(value ? formatARNumber(value, decimals) : '');
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={display}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={e => !readOnly && handleChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      className={className}
    />
  );
}
