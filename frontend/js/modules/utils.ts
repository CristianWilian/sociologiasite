export function exportAsCsv(fileName: string, headers: string[], rows: string[][]): void {
  const csvContent = [
    headers.map((h) => `"${h}"`).join(';'),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function openPdfWindow(title: string, columns: string[], rows: string[][]): void {
  const tableHtml = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #2f5d50; color: white;">
          ${columns.map((col) => `<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">${col}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>
              ${row.map((cell) => `<td style="border: 1px solid #ddd; padding: 12px;">${cell}</td>`).join('')}
            </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2f5d50; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${tableHtml}
    </body>
    </html>
  `;

  const pdfWindow = window.open('', '', 'height=600,width=800');
  if (pdfWindow) {
    pdfWindow.document.write(htmlContent);
    pdfWindow.document.close();
    setTimeout(() => pdfWindow.print(), 250);
  }
}
