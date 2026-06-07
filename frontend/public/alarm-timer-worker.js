let tickInterval = null;
let targetTs = null;

function stopTimer() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  targetTs = null;
}

function emitTick() {
  if (targetTs == null) {
    return;
  }

  const secondsLeft = Math.max(0, Math.floor((targetTs - Date.now()) / 1000));
  postMessage({ type: "TICK", secondsLeft });

  if (secondsLeft <= 0) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

self.onmessage = (event) => {
  const data = event.data || {};

  if (data.type === "START") {
    stopTimer();
    if (typeof data.targetTs !== "number") {
      return;
    }

    targetTs = data.targetTs;
    emitTick();
    tickInterval = setInterval(emitTick, 1000);
    return;
  }

  if (data.type === "STOP") {
    stopTimer();
  }
};
