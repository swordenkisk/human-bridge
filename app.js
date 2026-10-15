"use strict";

const STORAGE_KEY = "human-bridge.plans.v1";

const suggestions = {
  "reach-out": [
    "Send a simple hello without needing a big reason.",
    "Ask someone a small, specific question.",
    "Suggest a short call or walk, with an easy way to say no."
  ],
  company: [
    "Think of one person who feels comfortable to be around.",
    "Invite someone to do an ordinary activity together.",
    "Choose a public, people-friendly place and ask someone to join you."
  ],
  activity: [
    "Suggest a short walk, coffee, meal, or shared errand.",
    "Look for an activity you can try together without needing to talk constantly.",
    "Offer two simple options so making a plan is easier."
  ],
  listen: [
    "Ask someone you trust whether they have time to listen.",
    "Say what kind of support would help: listening, advice, or company.",
    "If one person is unavailable, consider another trusted person or a human-led support service."
  ],
  reflect: [
    "Write down what you want someone to understand.",
    "Consider whether there is a person you would feel okay sharing one part of this with.",
    "You can take time to reflect before deciding whether to reach out."
  ]
};

const starters = [
  "Hey, I was thinking of you. How have you been?",
  "Would you be up for a short walk or coffee sometime this week?",
  "Do you have a little time to talk? I could use someone to listen.",
  "No pressure to reply quickly, but I’d like to catch up when you can."
];

const needSelect = document.querySelector("#need");
const suggestionBox = document.querySelector("#suggestion");
const messageField = document.querySelector("#message");
const messageStatus = document.querySelector("#message-status");
const planField = document.querySelector("#plan");
const planList = document.querySelector("#plan-list");
const planStatus = document.querySelector("#plan-status");

function loadPlans() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.text === "string" &&
          typeof item.createdAt === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function storePlans(plans) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return true;
  } catch {
    planStatus.textContent =
      "This browser could not save your plans. You can still use the other features.";
    return false;
  }
}

function renderSuggestions() {
  const items = suggestions[needSelect.value] || [];
  const list = document.createElement("ul");

  for (const item of items) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  }

  suggestionBox.replaceChildren(list);
}

function renderPlans() {
  const plans = loadPlans();
  planList.replaceChildren();

  if (plans.length === 0) {
    const empty = document.createElement("li");
    empty.className = "hint";
    empty.textContent = "No saved plans on this device.";
    planList.append(empty);
    return;
  }

  for (const plan of plans) {
    const item = document.createElement("li");
    item.className = "plan-item";

    const text = document.createElement("p");
    text.textContent = plan.text;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "secondary";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove plan: ${plan.text}`);
    removeButton.addEventListener("click", () => removePlan(plan.id));

    item.append(text, removeButton);
    planList.append(item);
  }
}

function addPlan() {
  const text = planField.value.trim();

  if (!text) {
    planStatus.textContent = "Write a small plan first.";
    planField.focus();
    return;
  }

  const plans = loadPlans();
  plans.unshift({
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    createdAt: new Date().toISOString()
  });

  if (storePlans(plans)) {
    planField.value = "";
    planStatus.textContent = "Saved on this device.";
    renderPlans();
  }
}

function removePlan(id) {
  const plans = loadPlans().filter((plan) => plan.id !== id);
  if (storePlans(plans)) {
    planStatus.textContent = "Plan removed.";
    renderPlans();
  }
}

function addStarter() {
  const starter = starters[Math.floor(Math.random() * starters.length)];
  const current = messageField.value.trim();

  messageField.value = current ? `${current}\n${starter}` : starter;
  messageField.focus();
  messageStatus.textContent = "Starter added. Edit it to sound like you.";
}

async function copyMessage() {
  const message = messageField.value.trim();

  if (!message) {
    messageStatus.textContent = "Write a message before copying it.";
    messageField.focus();
    return;
  }

  try {
    await navigator.clipboard.writeText(message);
    messageStatus.textContent = "Copied. Nothing was sent.";
  } catch {
    messageField.focus();
    messageField.select();
    messageStatus.textContent =
      "Copy was blocked by the browser. Select the message and copy it manually.";
  }
}

function exportPlans() {
  const plans = loadPlans();

  if (plans.length === 0) {
    planStatus.textContent = "There are no plans to export.";
    return;
  }

  const content = JSON.stringify(plans, null, 2);
  const file = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = "human-bridge-plans.json";
  link.click();
  URL.revokeObjectURL(url);
  planStatus.textContent = "Your plans were exported.";
}

function clearPlans() {
  if (loadPlans().length === 0) {
    planStatus.textContent = "There are no saved plans to delete.";
    return;
  }

  const confirmed = window.confirm(
    "Delete all Human Bridge plans saved in this browser?"
  );

  if (!confirmed) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    planStatus.textContent = "All saved plans were deleted from this browser.";
    renderPlans();
  } catch {
    planStatus.textContent = "The browser could not delete the saved plans.";
  }
}

document.querySelector("#suggest-button").addEventListener("click", renderSuggestions);
document.querySelector("#starter-button").addEventListener("click", addStarter);
document.querySelector("#copy-button").addEventListener("click", copyMessage);
document.querySelector("#save-plan-button").addEventListener("click", addPlan);
document.querySelector("#export-button").addEventListener("click", exportPlans);
document.querySelector("#clear-button").addEventListener("click", clearPlans);

planField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addPlan();
});

renderPlans();
