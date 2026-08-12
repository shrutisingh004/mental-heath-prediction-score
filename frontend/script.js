const API_URL = "https://mental-heath-prediction-score.onrender.com";

const form = document.getElementById("predict-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");
const resultCard = document.getElementById("result-card");

const dialArcsGroup = document.getElementById("dial-arcs");
const dialTotalEl = document.getElementById("dial-total");
const dialOverflowEl = document.getElementById("dial-overflow");

const gaugeFill = document.getElementById("gauge-fill");
const gaugeNeedle = document.getElementById("gauge-needle");
const gaugeScoreEl = document.getElementById("gauge-score");

const hourFieldIds = [
  "sleep_hours_per_night",
  "avg_daily_usage_hours",
  "study_hours",
  "physical_activity_hours",
];

const dialSegmentMeta = [
  { id: "sleep_hours_per_night", color: "var(--primary)", legend: "leg-sleep" },
  { id: "avg_daily_usage_hours", color: "var(--accent)", legend: "leg-usage" },
  { id: "study_hours", color: "var(--study)", legend: "leg-study" },
  { id: "physical_activity_hours", color: "var(--activity)", legend: "leg-activity" },
];

const FIELD_DEFS = [
  { id: "age", type: "int", min: 10, max: 100 },
  { id: "gender", type: "str" },
  { id: "country", type: "str" },
  { id: "academic_level", type: "str" },
  { id: "most_used_platform", type: "str" },
  { id: "purpose_of_use", type: "str" },
  { id: "avg_daily_usage_hours", type: "float", min: 0, max: 24 },
  { id: "daily_unlocks", type: "int", min: 0 },
  { id: "study_hours", type: "float", min: 0, max: 24 },
  { id: "physical_activity_hours", type: "float", min: 0, max: 24 },
  { id: "sleep_hours_per_night", type: "float", min: 0, max: 24 },
  { id: "stress_level", type: "str" },
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.999) {
    endAngle = startAngle + 359.999;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function readHourValue(id) {
  const el = document.getElementById(id);
  const v = parseFloat(el.value);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

function updateDial() {
  const values = dialSegmentMeta.map((seg) => readHourValue(seg.id));
  const total = values.reduce((a, b) => a + b, 0);
  const cappedTotal = Math.min(total, 24);

  dialArcsGroup.innerHTML = "";
  let angleCursor = 0;

  dialSegmentMeta.forEach((seg, i) => {
    const hrs = values[i];
    if (hrs <= 0) return;
    // Scales the segments proportionally if the raw total exceeds 24, so the ring never visually overflows even while entries are mid-edit.
    const scale = total > 24 ? 24 / total : 1;
    const sweep = (hrs * scale * 360) / 24;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeArc(160, 160, 130, angleCursor, angleCursor + sweep));
    path.setAttribute("class", "dial-arc");
    path.style.stroke = seg.color;
    dialArcsGroup.appendChild(path);
    angleCursor += sweep;
  });

  dialTotalEl.textContent = cappedTotal.toFixed(1);
  dialOverflowEl.hidden = total <= 24;

  dialSegmentMeta.forEach((seg, i) => {
    document.getElementById(seg.legend).textContent = `${values[i].toFixed(1)}h`;
  });
}

hourFieldIds.forEach((id) => {
  document.getElementById(id).addEventListener("input", updateDial);
});
updateDial();

const GAUGE_ARC_LENGTH = 314; // approximate length of the semicircle path
const GAUGE_MAX = 10;

function updateGauge(score) {
  const clamped = Math.max(0, Math.min(GAUGE_MAX, score));
  const fraction = clamped / GAUGE_MAX;

  gaugeFill.style.strokeDashoffset = String(GAUGE_ARC_LENGTH * (1 - fraction));

  const hue = 8 + fraction * 150; // amber/red -> teal as score rises
  gaugeFill.style.stroke = `hsl(${hue}, 42%, 42%)`;

  const needleAngle = -90 + fraction * 180;
  gaugeNeedle.style.transform = `rotate(${needleAngle}deg)`;

  gaugeScoreEl.textContent = score.toFixed(2);
}

function setFieldError(id, message) {
  const errorEl = document.getElementById(`err-${id}`);
  const fieldWrap = document.getElementById(id).closest(".field");
  if (errorEl) errorEl.textContent = message || "";
  if (fieldWrap) fieldWrap.classList.toggle("field--invalid", Boolean(message));
}

function validateForm() {
  let firstInvalidEl = null;
  let isValid = true;
  const values = {};

  FIELD_DEFS.forEach(({ id, type, min, max }) => {
    const el = document.getElementById(id);
    const raw = el.value;
    let message = "";

    if (raw === null || raw === undefined || raw.trim() === "") {
      message = "This field is required.";
    } else if (type === "int" || type === "float") {
      const num = Number(raw);
      if (!Number.isFinite(num)) {
        message = "Enter a valid number.";
      } else if (type === "int" && !Number.isInteger(num)) {
        message = "Whole numbers only.";
      } else if (min !== undefined && num < min) {
        message = `Must be at least ${min}.`;
      } else if (max !== undefined && num > max) {
        message = `Must be ${max} or less.`;
      } else {
        values[id] = type === "int" ? Math.trunc(num) : num;
      }
    } else {
      values[id] = raw.trim();
    }

    setFieldError(id, message);
    if (message) {
      isValid = false;
      if (!firstInvalidEl) firstInvalidEl = el;
    }
  });

  if (!isValid && firstInvalidEl) {
    firstInvalidEl.focus();
  }

  return isValid ? values : null;
}

// Clears a field's error as soon as the person fixes it.
FIELD_DEFS.forEach(({ id }) => {
  document.getElementById(id).addEventListener("input", () => setFieldError(id, ""));
  document.getElementById(id).addEventListener("change", () => setFieldError(id, ""));
});

let isSubmitting = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isSubmitting) return;

  formError.hidden = true;
  formError.textContent = "";

  const payload = validateForm();
  if (!payload) return;

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.classList.add("is-loading");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = `Request failed (${response.status}).`;
      try {
        const errBody = await response.json();
        if (errBody?.detail) {
          detail = Array.isArray(errBody.detail)
            ? errBody.detail.map((d) => d.msg).join(" ")
            : String(errBody.detail);
        }
      } catch (_) {
      }
      throw new Error(detail);
    }

    const data = await response.json();
    const score = Number(data.predicted_mental_health_score);

    if (!Number.isFinite(score)) {
      throw new Error("The server response didn't include a valid score.");
    }

    updateGauge(score);
    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    const isNetworkError = err instanceof TypeError;
    formError.textContent = isNetworkError
      ? "Couldn't reach the prediction server. Is your FastAPI backend running?"
      : err.message || "Something went wrong. Please try again.";
    formError.hidden = false;
  } finally {
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
  }
});
