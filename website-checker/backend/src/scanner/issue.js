let counter = 0;

export function issue({ title, description, severity, aiFixAvailable = true }) {
  counter += 1;
  return {
    id: `issue-${counter}-${Date.now().toString(36)}`,
    title,
    description,
    severity, // "critical" | "medium" | "low"
    aiFixAvailable,
  };
}

const SEVERITY_WEIGHT = { critical: 30, medium: 12, low: 5 };

export function scoreFromIssues(issues) {
  const deduction = issues.reduce((sum, i) => sum + (SEVERITY_WEIGHT[i.severity] || 0), 0);
  return Math.max(0, Math.min(100, 100 - deduction));
}
