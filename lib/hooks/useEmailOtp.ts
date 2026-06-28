import { useRef, useState, type KeyboardEvent } from "react";
import { createClient } from "@/lib/supabase/client";

// Shared email-OTP flow (send 6-digit code → verify), extracted from the 3 near-identical
// copies in GameClient / StarbookClient / AdminGate. Owns the 6 digit boxes, their refs,
// and the send/verify/resend calls plus loading & error state. The caller keeps its own
// `email` state and drives navigation off the returned booleans, so the hook stays UI-agnostic.
export function useEmailOtp(onVerified?: () => void) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  async function send(email: string): Promise<boolean> {
    setSendError(null);
    if (!email) {
      setSendError("Please enter your email.");
      return false;
    }
    setSending(true);
    try {
      const { error } = await createClient().auth.signInWithOtp({ email });
      if (error) {
        setSendError(error.message || "Could not send code. Try again.");
        return false;
      }
      return true;
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Could not send code.");
      return false;
    } finally {
      setSending(false);
    }
  }

  async function verify(email: string): Promise<boolean> {
    const token = digits.join("").trim();
    if (token.length < 6) {
      setVerifyError("Enter all 6 digits.");
      return false;
    }
    setVerifying(true);
    setVerifyError(null);
    try {
      const { error } = await createClient().auth.verifyOtp({ email, token, type: "email" });
      if (error) {
        setVerifyError(error.message || "Invalid code. Try again.");
        return false;
      }
      onVerified?.();
      return true;
    } catch (e) {
      setVerifyError(e instanceof Error ? e.message : "Invalid code.");
      return false;
    } finally {
      setVerifying(false);
    }
  }

  async function resend(email: string) {
    setSendError(null);
    setVerifyError(null);
    try {
      await createClient().auth.signInWithOtp({ email });
    } catch {
      // resend is best-effort; the user can retry
    }
  }

  function reset() {
    setDigits(["", "", "", "", "", ""]);
    setSending(false);
    setSendError(null);
    setVerifying(false);
    setVerifyError(null);
  }

  // Wire one of the 6 boxes: keep a single digit, auto-advance on entry.
  function setDigit(i: number, v: string) {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const n = [...d];
      n[i] = ch;
      return n;
    });
    if (ch && i < 5) refs.current[i + 1]?.focus();
  }

  // Backspace on an empty box moves focus to the previous box (keyboard correction).
  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  return {
    digits,
    setDigit,
    handleKeyDown,
    refs,
    sending,
    sendError,
    verifying,
    verifyError,
    send,
    verify,
    resend,
    reset,
    setSendError,
    setVerifyError,
  };
}
