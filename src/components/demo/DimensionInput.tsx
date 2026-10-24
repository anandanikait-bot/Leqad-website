import { useEffect, useState, useId, useRef } from 'react';

// Keep the user's draft (including an empty field) separate from valid model values.
export function DimensionInput({ label, value, min, max, onChange, onValidityChange }: {
  label: string; value: number; min: number; max: number;
  onChange: (value: number) => void; onValidityChange: (valid: boolean) => void;
}) {
  const errorId = useId();
  const [draft, setDraft] = useState(String(value));
  const validity = useRef(onValidityChange);
  validity.current = onValidityChange;
  useEffect(() => {
    setDraft(String(value));
    validity.current(Number.isFinite(value) && value >= min && value <= max);
  }, [value, min, max]);
  const number = Number(draft);
  const valid = draft.trim() !== '' && Number.isFinite(number) && number >= min && number <= max;
  return <label className="min-w-0 space-y-1 text-xs font-medium text-[#55616B]">
    <span className="block">{label}</span>
    <input type="number" min={min} max={max} step={1} value={draft} aria-label={label} aria-describedby={valid ? undefined : errorId} aria-invalid={!valid}
      onChange={event => {
        const text = event.target.value;
        setDraft(text);
        const n = Number(text);
        const ok = text.trim() !== '' && Number.isFinite(n) && n >= min && n <= max;
        onValidityChange(ok);
        if (ok) onChange(n);
      }}
      className="block w-full min-w-0 rounded-md border border-[#D9DDD9] bg-white px-2.5 py-2 font-mono text-[#0E2943] aria-invalid:border-[#793327] focus-visible:outline-2 focus-visible:outline-[#793327]" />
    {!valid && <span id={errorId} className="block text-[11px] text-[#793327]">Enter {min}–{max} mm.</span>}
  </label>;
}
