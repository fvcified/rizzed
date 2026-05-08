"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";
const SCRAMBLE_PLC = 2;
const SCRAMBLE_SPD = 65;

const iniTxt = "rizz....";
const keepText = "rizz";
const appendTxt = "ed13";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function TypedText() {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let cancelled = false;

    function setText(val: string) {
      if (el) el.textContent = val;
    }

    function sSL(targetText: string, index: number, doneCallback: () => void) {
      let count = 0;
      function step() {
        if (cancelled) return;
        if (count < SCRAMBLE_PLC) {
          setText(targetText.substring(0, index) + randomChar());
          count++;
          setTimeout(step, SCRAMBLE_SPD);
        } else {
          setText(targetText.substring(0, index + 1));
          doneCallback();
        }
      }
      step();
    }

    function typeScr(targetText: string, callback: () => void) {
      let idx = 0;
      function typeNext() {
        if (cancelled) return;
        if (idx >= targetText.length) { callback(); return; }
        sSL(targetText, idx, () => { idx++; typeNext(); });
      }
      typeNext();
    }

    function rDFE(currentText: string, targetKeepText: string, callback: () => void) {
      let cur = currentText;
      function deleteStep() {
        if (cancelled) return;
        if (cur === targetKeepText) { callback(); return; }
        cur = cur.substring(0, cur.length - 1);
        setText(cur);
        setTimeout(deleteStep, SCRAMBLE_SPD);
      }
      deleteStep();
    }

    function rTE(currentText: string, callback: () => void) {
      let cur = currentText;
      function deleteStep() {
        if (cancelled) return;
        if (cur.length === 0) { callback(); return; }
        cur = cur.substring(0, cur.length - 1);
        setText(cur);
        setTimeout(deleteStep, SCRAMBLE_SPD);
      }
      deleteStep();
    }

    function runSequence() {
      if (cancelled) return;
      typeScr(iniTxt, () => {
        setTimeout(() => {
          rDFE(iniTxt, keepText, () => {
            setTimeout(() => {
              let idx = 0;
              function typeAppend() {
                if (cancelled) return;
                if (idx >= appendTxt.length) {
                  setTimeout(() => {
                    rTE(keepText + appendTxt, () => {
                      setTimeout(runSequence, 3000);
                    });
                  }, 3000);
                  return;
                }
                const target = keepText + appendTxt.substring(0, idx + 1);
                sSL(target, target.length - 1, () => { idx++; typeAppend(); });
              }
              typeAppend();
            }, 1500);
          });
        }, 1500);
      });
    }

    runSequence();
    return () => { cancelled = true; };
  }, []);

  return <span ref={textRef} />;
}
d