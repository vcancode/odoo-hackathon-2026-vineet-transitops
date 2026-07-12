/**
 * Export an array of objects as a CSV file for download.
 * @param {Array<Object>} data - The data rows
 * @param {Array<{key: string, header: string}>} columns - Column definitions
 * @param {string} filename - Filename without extension
 */
export const exportToCSV = (data, columns, filename = "export") => {
  if (!data || data.length === 0) return;

  // Build header row
  const headers = columns.map((col) => `"${col.header}"`).join(",");

  // Build data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let value = "";

        if (col.csvAccessor) {
          // Custom accessor for CSV (e.g., nested fields)
          value = col.csvAccessor(row);
        } else if (col.key) {
          value = row[col.key];
        }

        // Handle null/undefined
        if (value === null || value === undefined) value = "";

        // Convert to string and escape quotes
        value = String(value).replace(/"/g, '""');

        return `"${value}"`;
      })
      .join(",");
  });

  const csvContent = [headers, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
