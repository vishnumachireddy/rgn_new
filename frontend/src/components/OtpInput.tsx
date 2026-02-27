import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { motion } from "framer-motion";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: boolean;
}

const OtpInput = ({ length = 6, onComplete, error }: OtpInputProps) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
      setValues(Array(length).fill(""));
      refs.current[0]?.focus();
    }
  }, [error, length]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...values];
    next[index] = val;
    setValues(next);
    if (val && index < length - 1) refs.current[index + 1]?.focus();
    if (next.every((v) => v !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = [...values];
    paste.split("").forEach((ch, i) => { next[i] = ch; });
    setValues(next);
    if (next.every((v) => v !== "")) onComplete(next.join(""));
  };

  return (
    <div className="flex justify-center gap-3">
      {values.map((val, i) => (
        <motion.input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            borderColor: error ? "hsl(0 72% 51%)" : val ? "hsl(145 63% 42%)" : "hsl(220 15% 18%)",
          }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          className="h-14 w-12 rounded-xl border-2 bg-muted/30 text-center font-display text-xl font-bold text-foreground outline-none transition-all input-glow focus:border-secondary"
        />
      ))}
    </div>
  );
};

export default OtpInput;
