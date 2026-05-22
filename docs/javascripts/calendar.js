function openAncestorDetails(node) {
  let current = node?.parentElement;
  while (current) {
    if (current.tagName === "DETAILS") {
      current.open = true;
    }
    current = current.parentElement;
  }
}

function revealCalendarTarget(targetId) {
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  if (target.tagName === "DETAILS") {
    target.open = true;
  }

  openAncestorDetails(target);

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".day[data-target]");
  if (!card) {
    return;
  }

  revealCalendarTarget(card.dataset.target);
});

window.addEventListener("load", () => {
  if (window.location.hash.length > 1) {
    revealCalendarTarget(window.location.hash.slice(1));
  }
});

function parseActivityDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatActivityDate(date, options = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function formatActivityNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function toActivityDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addActivityDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function clampActivityDate(date, min, max) {
  if (date < min) {
    return new Date(min);
  }

  if (date > max) {
    return new Date(max);
  }

  return date;
}

function getActivityRows(start, end, byDate) {
  const rows = [];

  for (let day = new Date(start); day <= end; day = addActivityDays(day, 1)) {
    const key = toActivityDateKey(day);
    const entry = byDate.get(key) ?? {
      codeAdd: 0,
      codeDel: 0,
      publicAdd: 0,
      publicDel: 0,
      docsAdd: 0,
      docsDel: 0,
      commits: 0,
    };
    const codeAdd = entry.codeAdd ?? entry.appAdd ?? entry.add ?? 0;
    const codeDel = entry.codeDel ?? entry.appDel ?? entry.del ?? 0;
    const publicAdd = entry.publicAdd ?? 0;
    const publicDel = entry.publicDel ?? 0;
    const docsAdd = entry.docsAdd ?? 0;
    const docsDel = entry.docsDel ?? 0;

    rows.push({
      date: key,
      label: formatActivityDate(day),
      shortLabel: formatActivityDate(day, { month: "numeric", day: "numeric" }),
      codeAdd,
      codeDel,
      publicAdd,
      publicDel,
      docsAdd,
      docsDel,
      commits: entry.commits,
      total: codeAdd + codeDel + publicAdd + publicDel + docsAdd + docsDel,
    });
  }

  return rows;
}

function renderActivityGraph(graph, rangeName = "7d") {
  const dataNode = graph.querySelector("[data-activity-data]");
  const barsNode = graph.querySelector("[data-activity-bars]");
  const summaryNode = graph.querySelector("[data-activity-summary]");
  const maxNode = graph.querySelector("[data-activity-max]");
  const fromInput = graph.querySelector("[data-activity-from]");
  const toInput = graph.querySelector("[data-activity-to]");

  if (!dataNode || !barsNode || !summaryNode || !maxNode || !fromInput || !toInput) {
    return;
  }

  const activityData = JSON.parse(dataNode.textContent || "[]");
  const byDate = new Map(activityData.map((entry) => [entry.date, entry]));
  const minDate = parseActivityDate(graph.dataset.activityStart);
  const maxDate = parseActivityDate(graph.dataset.activityEnd);
  let startDate = maxDate;
  let endDate = maxDate;

  if (rangeName === "all") {
    startDate = minDate;
  } else if (rangeName === "1m") {
    startDate = addActivityDays(maxDate, -29);
  } else if (rangeName === "custom") {
    startDate = clampActivityDate(parseActivityDate(fromInput.value), minDate, maxDate);
    endDate = clampActivityDate(parseActivityDate(toInput.value), minDate, maxDate);
    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
  } else {
    startDate = addActivityDays(maxDate, -6);
  }

  startDate = clampActivityDate(startDate, minDate, maxDate);
  endDate = clampActivityDate(endDate, minDate, maxDate);
  fromInput.value = toActivityDateKey(startDate);
  toInput.value = toActivityDateKey(endDate);

  const rows = getActivityRows(startDate, endDate, byDate);
  const maxTotal = Math.max(1, ...rows.map((row) => row.total));
  const codeAdded = rows.reduce((sum, row) => sum + row.codeAdd, 0);
  const codeDeleted = rows.reduce((sum, row) => sum + row.codeDel, 0);
  const publicAdded = rows.reduce((sum, row) => sum + row.publicAdd, 0);
  const publicDeleted = rows.reduce((sum, row) => sum + row.publicDel, 0);
  const docsAdded = rows.reduce((sum, row) => sum + row.docsAdd, 0);
  const docsDeleted = rows.reduce((sum, row) => sum + row.docsDel, 0);
  const totalCommits = rows.reduce((sum, row) => sum + row.commits, 0);

  graph.dataset.activityActiveRange = rangeName;
  maxNode.style.setProperty("--activity-max", `"${formatActivityNumber(maxTotal)} line peak"`);
  summaryNode.innerHTML = `
    <strong>${formatActivityDate(startDate)} - ${formatActivityDate(endDate)}</strong>
    <span>Code +${formatActivityNumber(codeAdded)} / -${formatActivityNumber(codeDeleted)}; public +${formatActivityNumber(publicAdded)} / -${formatActivityNumber(publicDeleted)}; docs +${formatActivityNumber(docsAdded)} / -${formatActivityNumber(docsDeleted)} across ${formatActivityNumber(totalCommits)} commits</span>
  `;

  barsNode.innerHTML = rows
    .map((row) => {
      const totalHeight = row.total === 0 ? 0 : Math.max(2, (row.total / maxTotal) * 100);
      const codeAddedHeight = row.total === 0 ? 0 : (row.codeAdd / row.total) * 100;
      const codeDeletedHeight = row.total === 0 ? 0 : (row.codeDel / row.total) * 100;
      const publicAddedHeight = row.total === 0 ? 0 : (row.publicAdd / row.total) * 100;
      const publicDeletedHeight = row.total === 0 ? 0 : (row.publicDel / row.total) * 100;
      const docsAddedHeight = row.total === 0 ? 0 : (row.docsAdd / row.total) * 100;
      const docsDeletedHeight = row.total === 0 ? 0 : (row.docsDel / row.total) * 100;
      const commitLabel = row.commits === 1 ? "commit" : "commits";
      const title = `${row.label}: code +${formatActivityNumber(row.codeAdd)} / -${formatActivityNumber(row.codeDel)}, public +${formatActivityNumber(row.publicAdd)} / -${formatActivityNumber(row.publicDel)}, docs +${formatActivityNumber(row.docsAdd)} / -${formatActivityNumber(row.docsDel)}, ${formatActivityNumber(row.commits)} ${commitLabel}`;

      return `
        <div class="activity-day" title="${title}">
          <div class="activity-stack" style="height: ${totalHeight.toFixed(2)}%;">
            <span class="activity-code-added" style="height: ${codeAddedHeight.toFixed(2)}%;"></span>
            <span class="activity-code-deleted" style="height: ${codeDeletedHeight.toFixed(2)}%;"></span>
            <span class="activity-public-added" style="height: ${publicAddedHeight.toFixed(2)}%;"></span>
            <span class="activity-public-deleted" style="height: ${publicDeletedHeight.toFixed(2)}%;"></span>
            <span class="activity-docs-added" style="height: ${docsAddedHeight.toFixed(2)}%;"></span>
            <span class="activity-docs-deleted" style="height: ${docsDeletedHeight.toFixed(2)}%;"></span>
          </div>
          <span class="activity-day-label">${row.shortLabel}</span>
        </div>
      `;
    })
    .join("");
}

function initActivityGraphs() {
  document.querySelectorAll("[data-activity-graph]").forEach((graph) => {
    if (graph.dataset.activityReady === "true") {
      return;
    }

    graph.dataset.activityReady = "true";
    const buttons = graph.querySelectorAll("[data-activity-range]");
    const inputs = graph.querySelectorAll("[data-activity-from], [data-activity-to]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((otherButton) => {
          otherButton.setAttribute("aria-pressed", String(otherButton === button));
        });
        renderActivityGraph(graph, button.dataset.activityRange);
      });
    });

    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        buttons.forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.activityRange === "custom"));
        });
        renderActivityGraph(graph, "custom");
      });
    });

    renderActivityGraph(graph, "7d");
  });
}

document.addEventListener("DOMContentLoaded", initActivityGraphs);
window.addEventListener("load", initActivityGraphs);
