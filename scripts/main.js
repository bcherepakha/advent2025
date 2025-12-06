import { days, repoUrl, runnerPath } from "../data/days.js";

const gridEl = document.querySelector("#days-grid");
const solvedEl = document.querySelector("[data-solved-count]");
const totalEl = document.querySelector("[data-total-count]");
const daysEl = document.querySelector("[data-days-count]");
const percentEl = document.querySelector("[data-progress-percent]");
const progressFillEl = document.querySelector("[data-progress-fill]");
const progressBarEl = document.querySelector(".progress__bar");

function formatPercent(value) {
  return Math.round(value);
}

function computeProgress(data) {
  const totalParts = data.reduce((acc, day) => acc + day.parts.length, 0);
  const solvedParts = data.reduce(
    (acc, day) => acc + day.parts.filter((part) => part.solved).length,
    0
  );
  const solvedDays = data.filter((day) => day.parts.every((part) => part.solved)).length;

  return {
    totalParts,
    solvedParts,
    solvedDays,
    percent: totalParts === 0 ? 0 : (solvedParts / totalParts) * 100,
  };
}

function renderProgress(progress) {
  solvedEl.textContent = progress.solvedParts;
  totalEl.textContent = progress.totalParts;
  daysEl.textContent = progress.solvedDays;
  percentEl.textContent = formatPercent(progress.percent);

  progressFillEl.style.width = `${progress.percent}%`;
  progressBarEl.setAttribute("aria-valuenow", formatPercent(progress.percent));
}

function createActionLinks(partMeta) {
  const container = document.createElement("div");
  container.className = "day-card__actions";

  const detail = document.createElement(partMeta.detailLink ? "a" : "button");
  detail.className = "btn btn--ghost btn--small";
  detail.textContent = partMeta.detailLink ? "Сторінка дня" : "Сторінка скоро";

  if (partMeta.detailLink) {
    detail.href = partMeta.detailLink;
  } else {
    detail.type = "button";
    detail.disabled = true;
    detail.setAttribute("aria-disabled", "true");
  }

  const github = document.createElement("a");
  github.className = "btn btn--primary btn--small";
  github.href = partMeta.githubLink;
  github.target = "_blank";
  github.rel = "noreferrer";
  github.textContent = "GitHub";

  const aoc = document.createElement("a");
  aoc.className = "text-link";
  aoc.href = partMeta.aocLink;
  aoc.target = "_blank";
  aoc.rel = "noreferrer";
  aoc.textContent = "Advent of Code";

  container.append(detail, github, aoc);
  return container;
}

function createCard(dayMeta, partMeta) {
  const card = document.createElement("article");
  card.className = `day-card ${partMeta.solved ? "is-solved" : "is-locked"}`;

  const header = document.createElement("header");
  header.className = "day-card__header";

  const badge = document.createElement("div");
  badge.className = "day-card__badge";
  badge.textContent = `Day ${String(dayMeta.day).padStart(2, "0")} · Part ${partMeta.part}`;

  const status = document.createElement("span");
  status.className = "day-card__status";
  status.textContent = partMeta.solved ? "Розв’язано" : "У процесі";

  header.append(badge, status);

  const title = document.createElement("h3");
  title.textContent = partMeta.title || "Без названия";

  const sub = document.createElement("p");
  sub.className = "day-card__subtitle";
  sub.textContent =
    partMeta.solved && dayMeta.title !== "TBD"
      ? "Готово, скоро будуть візуалізації та пояснення."
      : "Рішення в процесі, візуал з’явиться пізніше.";

  const actions = createActionLinks(partMeta);

  card.append(header, title, sub, actions);
  return card;
}

function renderCards(data) {
  gridEl.innerHTML = "";
  const sorted = [...data].sort((a, b) => a.day - b.day);

  for (const day of sorted) {
    for (const part of day.parts) {
      const card = createCard(day, part);
      gridEl.appendChild(card);
    }
  }
}

function hydrateLinks() {
  const runnerLink = document.querySelectorAll(`a[href="runner.html"]`);
  runnerLink.forEach((link) => {
    link.href = runnerPath;
  });

  const repoLinks = document.querySelectorAll(
    `a[href="https://github.com/bcherepakha/advent2025"]`
  );
  repoLinks.forEach((link) => {
    link.href = repoUrl;
  });
}

function init() {
  const progress = computeProgress(days);
  renderProgress(progress);
  renderCards(days);
  hydrateLinks();
}

init();
