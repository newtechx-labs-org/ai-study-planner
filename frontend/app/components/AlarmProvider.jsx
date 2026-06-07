"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { getNextReminder } from "@/services/reminderService";
import { getSubjects } from "@/services/subjectService";

function formatFullDatetime(d) {
  if (!d) return "";
  try {
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return String(d);
  }
}

// simple melodic alarm using WebAudio API (avoids external audio file)
function playMelodicAlarm(stopSignalRef) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.001;
    master.connect(ctx.destination);

    // resume if suspended due to autoplay policies
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const notes = [880, 988, 1175, 988, 880];
    const durations = [0.35, 0.35, 0.6, 0.35, 0.6];
    let t = ctx.currentTime + 0.02;

    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(master);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + durations[i]);
      o.start(t);
      o.stop(t + durations[i] + 0.02);
      t += durations[i] + 0.02;
    });

    // fade in master
    master.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + 0.05);

    // stop after sequence completes or when stopSignalRef set
    const total = durations.reduce((a, b) => a + b, 0) + 0.4;
    let closed = false;
    const safeClose = () => {
      try {
        if (closed) return;
        closed = true;
        if (ctx && typeof ctx.close === "function" && ctx.state !== "closed") {
          ctx.close().catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    };

    const stopTimer = setTimeout(() => {
      try {
        if (!closed) {
          master.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.5,
          );
          setTimeout(safeClose, 600);
        }
      } catch (e) {
        safeClose();
      }
    }, total * 1000);

    // return a stopper
    return () => {
      try {
        clearTimeout(stopTimer);
        if (!closed) {
          try {
            master.gain.exponentialRampToValueAtTime(
              0.0001,
              ctx.currentTime + 0.05,
            );
          } catch (e) {
            // ignore
          }
          setTimeout(safeClose, 200);
        }
      } catch (e) {
        safeClose();
      }
    };
  } catch (e) {
    return null;
  }
}

export default function AlarmProvider({ children }) {
  const pathname = usePathname();
  const [reminder, setReminder] = useState(null);
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [countdown, setCountdown] = useState(null);
  const stopperRef = useRef(null);
  const playedForRef = useRef(null);
  const STALE_THRESHOLD = 60; // seconds after scheduled time to consider stale
  const prevCountdownRef = useRef(null);
  const ignoreInitialDueRef = useRef(false);
  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  const fetchNext = async () => {
    try {
      const res = await getNextReminder();
      if (res && res.reminder) {
        // compute next occurrence locally in user's timezone from reminder data
        const computeNextLocal = (rem) => {
          if (!rem) return null;
          const now = new Date();
          const type = rem.type;
          const data = rem.data || {};
          if (type === "daily") {
            const times = data.times || [];
            const candidates = times
              .map((t) => {
                const [hh, mm] = (t || "").split(":");
                if (hh == null) return null;
                const c = new Date(now);
                c.setHours(parseInt(hh, 10) || 0, parseInt(mm, 10) || 0, 0, 0);
                if (c <= now) c.setDate(c.getDate() + 1);
                return c;
              })
              .filter(Boolean);
            if (!candidates.length) return null;
            return candidates.reduce((a, b) => (a < b ? a : b));
          }

          if (type === "one_day") {
            const at = data.at;
            if (!at) return null;
            const d = new Date(at);
            return d > now ? d : null;
          }

          if (type === "weekdays") {
            const days = data.days || [];
            const tstr = data.time;
            if (!days || !tstr) return null;
            const weekdayMap = {
              Mon: 1,
              Tue: 2,
              Wed: 3,
              Thu: 4,
              Fri: 5,
              Sat: 6,
              Sun: 0,
            };
            const target = (d) => weekdayMap[d];
            const tt = tstr.split(":");
            const hh = parseInt(tt[0], 10) || 0;
            const mm = parseInt(tt[1], 10) || 0;
            for (let offset = 0; offset < 14; offset++) {
              const cand = new Date(now);
              cand.setDate(now.getDate() + offset);
              if (
                days.includes(
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    cand.getDay()
                  ],
                )
              ) {
                cand.setHours(hh, mm, 0, 0);
                if (cand > now) return cand;
              }
            }
            return null;
          }

          if (type === "custom") {
            const slots = data.slots || [];
            const future = slots
              .map((s) => new Date(s))
              .filter((d) => d instanceof Date && !isNaN(d) && d > new Date());
            if (!future.length) return null;
            return future.reduce((a, b) => (a < b ? a : b));
          }

          return null;
        };

        const nextLocal = computeNextLocal(res.reminder);
        const dt = nextLocal
          ? nextLocal
          : res.next_run
            ? new Date(res.next_run)
            : null;
        // if reminder time is too far in the past, treat it as stale and ignore
        const secs = dt ? Math.floor((dt.getTime() - Date.now()) / 1000) : null;
        if (secs < -STALE_THRESHOLD) {
          setReminder(null);
          setCountdown(null);
          setSubjectName("");
          return;
        }

        ignoreInitialDueRef.current = secs != null && secs <= 0;

        setReminder({ ...res, next_run: dt });
        setCountdown(secs != null ? Math.max(0, secs) : null);
        // try to resolve subject name if provided in reminder data
        const subjId = res.reminder?.data?.subject_id || res.subject_id;
        if (subjId) {
          try {
            const subs = await getSubjects();
            const found = (subs || []).find((s) => s.id === subjId);
            setSubjectName(found ? found.name : "");
          } catch (e) {
            setSubjectName("");
          }
        }
      } else {
        setReminder(null);
        setCountdown(null);
        setSubjectName("");
      }
    } catch (e) {
      setReminder(null);
      setCountdown(null);
    }
  };

  useEffect(() => {
    if (isAuthRoute) {
      return;
    }

    fetchNext();
    const iv = setInterval(fetchNext, 30000);
    return () => clearInterval(iv);
  }, [isAuthRoute]);

  useEffect(() => {
    if (countdown == null) return;
    const id = setInterval(() => {
      setCountdown((c) => (c == null ? c : Math.max(0, c - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  useEffect(() => {
    if (!reminder || countdown == null) {
      prevCountdownRef.current = countdown;
      return;
    }

    const dismissed =
      typeof window !== "undefined" &&
      localStorage.getItem(`alarmDismissed:${reminder.reminder_id}`);

    const prev = prevCountdownRef.current;

    // only trigger when countdown transitions from >0 to <=0
    const justElapsed = prev != null && prev > 0 && countdown <= 0;

    if (
      justElapsed &&
      !dismissed &&
      playedForRef.current !== reminder.reminder_id &&
      !ignoreInitialDueRef.current
    ) {
      setOpen(true);
      stopperRef.current = playMelodicAlarm();
      playedForRef.current = reminder.reminder_id;
    }

    prevCountdownRef.current = countdown;
  }, [countdown, reminder]);

  // listen for manual test events so users can verify alarm across pages
  useEffect(() => {
    const handler = (e) => {
      try {
        const detail = e.detail || {};
        const name = detail.subjectName || detail.title || "Test Alarm";
        setSubjectName(name);
        // mark as test id so dismissal won't affect real reminders
        const testId = `__test__${Date.now()}`;
        playedForRef.current = testId;
        setOpen(true);
        if (stopperRef.current) {
          try {
            stopperRef.current();
          } catch (err) {}
        }
        stopperRef.current = playMelodicAlarm();
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener("alarm:test", handler);
    return () => window.removeEventListener("alarm:test", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    // persist dismissal so this reminder won't re-open
    try {
      if (reminder && reminder.reminder_id && typeof window !== "undefined") {
        localStorage.setItem(`alarmDismissed:${reminder.reminder_id}`, "1");
      }
    } catch (e) {}

    if (stopperRef.current) {
      try {
        stopperRef.current();
      } catch (e) {}
      stopperRef.current = null;
    }
  };

  return (
    <>
      {children}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alarm-dialog"
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogContent
          sx={{ background: "linear-gradient(90deg,#fafafa,#fff)", p: 3 }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: "linear-gradient(135deg,#F97316,#FB923C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              ⏰
            </div>

            <div style={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {subjectName ||
                  (reminder && reminder.title) ||
                  "Study Reminder"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>
                {reminder ? formatFullDatetime(reminder.next_run) : ""}
              </Typography>
              <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                It's study time — seize the moment, focus for a productive
                session, and move one step closer to your goals.
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, background: "#fff" }}>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
