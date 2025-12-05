// import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import store from "../../store/store";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// Function to export data to Excel
// export const exportToExcel = (data, fileName, header1, header2,condition=false) => {
//   const ws = XLSX.utils.json_to_sheet(data);

//   // Calculate maximum column widths
//   const maxWidths = data.reduce((colWidths, row) => {
//     Object.keys(row).forEach((key, index) => {
//       const value = row[key]?.toString() || "";
//       colWidths[index] = Math.max(colWidths[index] || 0, value.length);
//     });
//     return colWidths;
//   }, []);

//   // Set column widths in the worksheet
//   ws["!cols"] = maxWidths.map((width) => ({ wch: width + 2 }));

//   // Add filters to the first row
//   ws["!autofilter"] = {
//     ref: XLSX.utils.encode_range({
//       s: { c: 0, r: 0 }, // Start column and row
//       e: { c: maxWidths.length - 1, r: data.length }, // End column and row
//     }),
//   };

//   // Create and append worksheet to a new workbook
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//   // Save the workbook
//   XLSX.writeFile(wb, `${fileName}.xlsx`);
// };


export const exportToExcel = async (data, header1, header2, condition = false,fileName) => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Determine the number of columns dynamically
  const numColumns = Object.keys(data[0] || {}).length;
  let rowNumber = 1; // Track row numbers dynamically

  // ✅ Conditional Heading 1 (Title)
  if (header1) {
    const titleRow = worksheet.addRow([header1]);
    titleRow.font = { bold: true, size: 16, color: { argb: condition ? "FF0000" : "000000" } }; // Red if condition is true
    titleRow.alignment = { horizontal: "center", vertical: "middle",wrapText: true };
    const lineCount = (header1.match(/\n/g) || []).length + 1;
    console.log("first" , lineCount)
    titleRow.height = 30 * lineCount;
    worksheet.mergeCells(rowNumber, 1, rowNumber, numColumns);
    rowNumber++; // Move to the next row
  }

  // ✅ Conditional Heading 2 (Subtitle)
  if (header2) {
    const subtitleRow = worksheet.addRow([header2]);
    subtitleRow.font = { bold: true, size: 14 };
    subtitleRow.alignment = { horizontal: "center", vertical: "middle" };
    subtitleRow.height = 25;

    // 🔹 Change background color based on condition
    if (header2.includes("Summary")) {
      subtitleRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } }; // Yellow
      });
    }

    worksheet.mergeCells(rowNumber, 1, rowNumber, numColumns);
    rowNumber++;
  }

  // ✅ Column Headers (Row 3)
  const columnHeaders = Object.keys(data[0]);
  const headerRow = worksheet.addRow(columnHeaders);
  headerRow.font = { bold: true, size: 12 };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };
    cell.font = { color: { argb: "FFFFFF" }, bold: true };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // ✅ Apply Filter on Row
  worksheet.autoFilter = { from: { row: rowNumber, column: 1 }, to: { row: rowNumber, column: numColumns } };

  // ✅ Add Data (from next row onwards)
  data.forEach((rowData) => {
    const row = worksheet.addRow(Object.values(rowData));
    row.height = 15;
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  // ✅ Add Thick Border Around Data
  const lastRow = worksheet.rowCount;
  const lastColumn = worksheet.columnCount;
  for (let i = 1; i <= lastRow; i++) {
    for (let j = 1; j <= lastColumn; j++) {
      const cell = worksheet.getCell(i, j);
      // cell.border = {
      //   top: { style: i === 1 ? "thick" : "thin" },
      //   bottom: { style: i === lastRow ? "thick" : "thin" },
      //   left: { style: j === 1 ? "thick" : "thin" },
      //   right: { style: j === lastColumn ? "thick" : "thin" },
      // };
    }
  }

  // ✅ Auto-adjust column width
  worksheet.columns.forEach((column) => { column.width = 20; });

  // ✅ Create & Download Excel File
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${fileName?fileName:header1}.xlsx`);
};




// Function to export HTML content to PDF
export const exportHtmlToPDF = async (elementId, fileName) => {
  store.dispatch(setLoading(true));
  const hiddenTemplate = window.document.getElementById(elementId).innerHTML;

  // Temporarily show the element
  // hiddenTemplate.style.display = "block";

  const options = {
    margin: 0.5,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 }, // Adjust quality if needed
    html2canvas: { scale: 2 }, // Adjust settings for performance
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { after: "section", mode: ["avoid-all", "css", "legacy"] }, // Handling page breaks
  };

  try {
    // Convert the temporary container to PDF and save
    // Adding a footer with page numbers
    await html2pdf()
      .from(hiddenTemplate)
      .set(options)
      .toContainer()
      .toCanvas()
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        console.log("getHeight:" + pdf.internal.pageSize.getHeight());
        console.log("getWidth:" + pdf.internal.pageSize.getWidth());
        // const headerContent = document.querySelector('.main-template-Container').outerHTML;

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          pdf.setFontSize(8);
          pdf.setTextColor(64, 64, 64);
          pdf.text(
            "Page " + i + " of " + totalPages,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.2
          );
        }
      })
      .save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};


export const exportHtmlToPDFNoPrint = async (elementId, fileName,width="200px",orientation="portrait") => {
  store.dispatch(setLoading(true));
  const hiddenTemplate = window.document.getElementById(elementId);

  // Clone the actual element
  const clonedElement = hiddenTemplate.cloneNode(true);

  // clonedElement.querySelectorAll(".no-print").forEach(el => el.remove());

  // Remove .no-print elements and their empty parents
  clonedElement.querySelectorAll(".no-print").forEach(el => {
    const parent = el.parentNode;
    el.remove();
    if (parent && parent.childElementCount === 0) parent.remove();
  });


  const options = {
    margin:[0.2, 0.2, 0.4, 0],
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2,windowWidth: width },
    jsPDF: { unit: "in", format: "a4", orientation: orientation },
    pagebreak: { after: "section", mode: ["avoid-all", "css", "legacy"] } // Fix page break issues
  };

  try {
    await html2pdf()
      .from(clonedElement)
      .set(options)
      .toContainer()
      .toCanvas()
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(64, 64, 64);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.2
          );
        }
      })
      .save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
// export const generatePDF = (data) => {
//   const doc = new jsPDF();

//   // Or use javascript directly:
//   autoTable(doc, {
//     head: [["Name", "Email", "Country"]],
//     body: [
//       ["David", "david@example.com", "Sweden"],
//       ["Castille", "castille@example.com", "Spain"],
//       // ...
//     ],
//   });

//   doc.save("table.pdf");
// };
