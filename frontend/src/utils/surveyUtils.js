/**
 * Survey utility functions for shared logic across the frontend.
 */

/**
 * Checks if a survey is currently open for responses.
 * @param {Object} s - The survey object.
 * @returns {boolean}
 */
export function isSurveyOpen(s) {
  if (!s) return false;
  if (s.closedAt) return false;
  
  const now = new Date();
  if (s.opensAt && new Date(s.opensAt) > now) return false;
  if (s.closesAt && new Date(s.closesAt) < now) return false;
  
  return true;
}

/**
 * Formats a "Due In X Days" string for a survey.
 * @param {Object} survey - The survey object.
 * @returns {string}
 */
export function formatDue(survey) {
  if (!survey?.closesAt) return "No due date";
  const d = new Date(survey.closesAt);
  const now = new Date();
  const diffDays = Math.ceil((d - now) / 86400000);
  
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days (${d.toLocaleDateString()})`;
}

/**
 * Parses CSV raw text into an array of objects.
 * Expects a header row. Handles case-insensitive headers and trim.
 * @param {string} text - The raw CSV content.
 * @returns {Array<Object>}
 */
export function parseCSV(text) {
  if (!text) return [];
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  
  const header = lines[0].toLowerCase().replace(/\s/g, "").split(",");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
    const row = {};
    header.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

/**
 * Maps a raw CSV row to a specific user object structure.
 * @param {Object} row 
 * @returns {Object}
 */
export function mapCSVRowToUser(row) {
  const get = (k) => (row[k] ?? row[k.replace(/\s/g, "")] ?? "").trim();
  return {
    username: get("username"),
    displayName: get("displayname") || get("displayName"),
    role: (get("role") || "student").toLowerCase(),
    class: get("class"),
    yearLevel: get("yearlevel") || get("yearLevel"),
    password: get("password"),
  };
}

/**
 * Gets initials from a display name.
 * @param {string} name 
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formats a last login relative time string.
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatLastLogin(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleString();
}

/**
 * Handles browser-side CSV export from string or blob.
 * @param {string|Blob} content - The CSV data.
 * @param {string} fileName - The desired file name.
 */
export function handleExportCsv(content, fileName = "export.csv") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
