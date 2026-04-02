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
