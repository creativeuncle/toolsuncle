import { issue } from "../issue.js";

export function accessibilityCheck(ctx) {
  const issues = [];
  const { page, browser } = ctx;

  const missingAlt = page.images.filter((i) => !i.hasAlt).length;
  if (missingAlt > 0) {
    issues.push(
      issue({
        title: "Images without alt",
        description: `${missingAlt} image(s) have no alt attribute, making them invisible to screen reader users.`,
        severity: "medium",
      })
    );
  }

  const unlabeledInputs = page.inputsWithoutLabels.filter((i) => !i.hasLabel).length;
  if (unlabeledInputs > 0) {
    issues.push(
      issue({
        title: "Form labels missing",
        description: `${unlabeledInputs} form field(s) have no associated <label>, aria-label, or aria-labelledby.`,
        severity: "medium",
      })
    );
  }

  let skipped = false;
  let lastLevel = 0;
  page.headingOrder.forEach((h) => {
    if (lastLevel && h.level - lastLevel > 1) skipped = true;
    lastLevel = h.level;
  });
  if (skipped) {
    issues.push(issue({ title: "Poor heading hierarchy", description: "Heading levels are skipped (e.g. H1 to H3 with no H2), which confuses screen reader navigation.", severity: "low" }));
  }

  const unlabeledIconButtons = page.iconOnlyButtons.filter((b) => !b.hasText && b.hasIconChild && !b.hasAriaLabel).length;
  if (unlabeledIconButtons > 0) {
    issues.push(
      issue({
        title: "Missing ARIA where appropriate",
        description: `${unlabeledIconButtons} icon-only button(s)/link(s) have no accessible name (aria-label or title).`,
        severity: "medium",
      })
    );
  }

  const nonFocusableInteractive = page.nonInteractiveWithOnclick.filter((n) => !n.hasTabindex).length;
  if (nonFocusableInteractive > 0) {
    issues.push(
      issue({
        title: "Keyboard navigation problems",
        description: `${nonFocusableInteractive} non-interactive element(s) (div/span) have onclick handlers but no tabindex, so keyboard users can't reach them.`,
        severity: "low",
      })
    );
  }

  if (!page.lang) {
    issues.push(issue({ title: "Missing HTML lang attribute", description: "The <html> tag has no lang attribute, which affects screen readers and translation tools.", severity: "low" }));
  }

  const comingSoon = ["Full screen reader simulation"];

  if (browser?.ok) {
    if (browser.contrastIssues.length > 0) {
      const sample = browser.contrastIssues[0];
      issues.push(
        issue({
          title: "Low color contrast",
          description: `${browser.contrastIssues.length} of ${browser.contrastChecked} checked text element(s) fail WCAG contrast (e.g. "${sample.text}" at ${sample.ratio}:1).`,
          severity: "medium",
        })
      );
    }
    if (browser.keyboard.noFocusIndicator > 0) {
      issues.push(
        issue({
          title: "Missing keyboard focus indicator",
          description: `${browser.keyboard.noFocusIndicator} of ${browser.keyboard.totalFocusable} focusable element(s) show no visible outline/box-shadow when focused, making keyboard navigation hard to follow.`,
          severity: "medium",
        })
      );
    }
  } else {
    comingSoon.unshift("Color contrast analysis and keyboard-focus walkthrough — browser check unavailable for this scan");
  }

  return {
    id: "accessibility",
    name: "Accessibility",
    issues,
    comingSoon,
  };
}
