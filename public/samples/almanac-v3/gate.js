/* Stop 1, the gate: the scroll scrubs one number, --p, on the stage. */
(() => {
  const gate = document.getElementById("gate");
  if (!gate || typeof V3 === "undefined") return;
  const stage = gate.querySelector(".stage");
  V3.pin(gate, (p) => {
    if (V3.still()) return;
    stage.style.setProperty("--p", p.toFixed(4));
  });
  document.addEventListener("v3:quiet", (e) => { if (e.detail.on) stage.style.removeProperty("--p"); });
})();
