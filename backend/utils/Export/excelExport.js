const ExcelJS = require("exceljs");
//utils/Export/excelExport.js

/**
 * Reusable utility to export data to a beautifully formatted Excel sheet.
 * @param {Object} options
 * @param {Object} options.res - Express response object
 * @param {string} [options.fileName="Report"] - Downloadable file name (without extension)
 * @param {string} [options.sheetName="Sheet1"] - Name of the excel worksheet tab
 * @param {Array<Object>} [options.columns=[]] - ExcelJS columns configurations definitions
 * @param {Array<Object|Array>} [options.rows=[]] - Dataset array to populate into rows
 * @param {Array<{label: string, value: any}>} [options.summary=[]] - Optional metadata key-value rows at the top
 */
exports.exportToExcel = async ({
  res,
  fileName = "Report",
  sheetName = "Sheet1",
  columns = [],
  rows = [],
  summary = []
}) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Mantar E-commerce";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    // ======================================================
    // 1. SUMMARY BLOCK (PRE-HEADER)
    // ======================================================
    if (summary && summary.length > 0) {
      summary.forEach(item => {
        const row = worksheet.addRow([item.label, item.value]);
        row.getCell(1).font = { bold: true };
      });
      worksheet.addRow([]); // Blank spacer row
    }

    // ======================================================
    // 2. HEADER INJECTION & STYLING
    // ======================================================
    // Track row index where headers actually sit
    const headerRowNumber = worksheet.rowCount + 1;

    worksheet.columns = columns;

    const headerRow = worksheet.getRow(headerRowNumber);
    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11
    };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F4E78" } // Corporate Slate Navy
    };
    headerRow.alignment = {
      vertical: "middle",
      horizontal: "left"
    };

    // ======================================================
    // 3. DATA POPULATION & ROW INTERPOLATION
    // ======================================================
    rows.forEach((rowData) => {
      worksheet.addRow(rowData);
    });

    // Apply custom grid line styles (Zebra striping on data lines)
    worksheet.eachRow((row, rowNumber) => {
      row.height = 24; // Generous breathing room padding

      // Zebra stripe target rows below the primary header row
      if (rowNumber > headerRowNumber && rowNumber % 2 === 0) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F8F9FA" } // Clean off-white zebra highlight
          };
        });
      }
    });

    // ======================================================
    // 4. DYNAMIC AUTO-FIT COLUMN WIDTHS
    // ======================================================
    worksheet.columns.forEach((column) => {
      let maxLength = 14;

      column.eachCell?.({ includeEmpty: true }, (cell) => {
        let cellValueString = "";

        if (cell.value !== null && cell.value !== undefined) {
          if (typeof cell.value === "object") {
            // Safely evaluate dates or standard formulas objects
            cellValueString = cell.value.result || cell.value.toDateString?.() || JSON.stringify(cell.value);
          } else {
            cellValueString = cell.value.toString();
          }
        }

        if (cellValueString.length > maxLength) {
          maxLength = cellValueString.length;
        }
      });

      column.width = maxLength + 4; // Buffer padding for visibility
    });

    // ======================================================
    // 5. WINDOW VIEW FREEZE CONFIGURATIONS
    // ======================================================
    worksheet.views = [
      {
        state: "frozen",
        ySplit: headerRowNumber // Intelligently pins below your header dynamic line
      }
    ];

    // ======================================================
    // 6. RESPONSE STREAM PIPELINE
    // ======================================================
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}".xlsx`
    );

    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    // Fallback error guard if structural streaming pipeline breaks midway
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Export layout failed generation", error: error.message });
    }
  }
};