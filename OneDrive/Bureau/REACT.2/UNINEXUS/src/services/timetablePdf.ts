import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TimetableSlot } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JsPdfConstructor: any = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;

export interface GeneratePdfOptions {
  program?: string;
  semester?: string;
  academicYear?: string;
  slots: TimetableSlot[];
  publishedDate?: string;
}

export const createTimetablePDF = ({
  program = "LEVEL 2 - BA2A",
  semester = "Semester 2",
  academicYear = "2025/2026",
  slots,
  publishedDate = "3/27/2026",
}: GeneratePdfOptions): jsPDF => {
  // Landscape orientation for comprehensive weekly view
  const doc = new JsPdfConstructor({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const days = [
    { name: "Monday", header: "Monday\n30th MAR" },
    { name: "Tuesday", header: "Tuesday\n31st MAR" },
    { name: "Wednesday", header: "Wednesday\n1st APR" },
    { name: "Thursday", header: "Thursday\n2nd APR" },
    { name: "Friday", header: "Friday\n3rd APR" },
    { name: "Saturday", header: "Saturday\n4th APR" },
  ] as const;

  const timeSlots = [
    { start: "07:30", end: "09:30", label: "07:30-09:30", isBreak: false },
    { start: "09:30", end: "11:30", label: "09:30-11:30", isBreak: false },
    { start: "11:30", end: "12:45", label: "BREAK: 11:30-\n12:45", isBreak: true },
    { start: "12:45", end: "14:45", label: "12:45-14:45", isBreak: false },
    { start: "14:45", end: "16:45", label: "14:45-16:45", isBreak: false },
  ];

  const pageWidth = doc.internal.pageSize.getWidth(); // ~297 mm

  // Institutional Header (Centered matching official document)
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Inter-States Institute of Higher Education", pageWidth / 2, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Cameroon Representation", pageWidth / 2, 17, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("PAUL BIYA TECHNOLOGICAL CENTRE OF EXCELLENCE", pageWidth / 2, 22, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("P.O. Box 13 719 Yaounde (Cameroon) Tel. (237) 242 72 99 57 - 242 72 99 58", pageWidth / 2, 26.5, { align: "center" });
  doc.text("Website: www.iaicameroun.com E-mail: contact@iaicameroun.com", pageWidth / 2, 30.5, { align: "center" });

  // Weekly Schedule Title Banner
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const weekTitle = program.includes("LEVEL")
    ? `WEEK: 30TH MAR – 4TH APR 2026 ${program.toUpperCase()}`
    : `WEEK: 30TH MAR – 4TH APR 2026 ${program.toUpperCase()}`;
  doc.text(weekTitle, pageWidth / 2, 36, { align: "center" });

  // Prepare table data
  const tableRows = timeSlots.map((time) => {
    if (time.isBreak) {
      const breakRow: unknown[] = [
        {
          content: time.label,
          styles: {
            fillColor: [254, 243, 199], // Amber-100
            textColor: [146, 64, 14], // Amber-800
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
          },
        },
      ];
      days.forEach(() => {
        breakRow.push({
          content: "BREAK",
          styles: {
            fillColor: [254, 243, 199],
            textColor: [146, 64, 14],
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
          },
        });
      });
      return breakRow;
    }

    const row: unknown[] = [time.label];
    days.forEach((dayItem) => {
      const match = slots.find((s) => s.day === dayItem.name && s.startTime === time.start);
      if (match) {
        let content = `${match.courseTitle}\n${match.lecturerName}\nLocation : ${match.classroom}`;
        if (match.hoursProgress) {
          content += `\n${match.hoursProgress}`;
        }

        row.push({
          content,
          styles: {
            fillColor: [255, 255, 255],
            textColor: [15, 23, 42],
            fontStyle: "bold",
            lineWidth: 0.2,
            lineColor: [226, 232, 240],
            halign: "center",
            valign: "middle",
          },
        });
      } else {
        row.push({
          content: "",
          styles: { fillColor: [255, 255, 255] },
        });
      }
    });

    return row;
  });

  autoTable(doc, {
    startY: 40,
    head: [["Time/Days", ...days.map((d) => d.header)]],
    body: tableRows as never,
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59], // Dark slate matching screenshot
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
      valign: "middle",
      minCellHeight: 12,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: "middle",
      overflow: "linebreak",
      minCellHeight: 19,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: "bold", halign: "center", valign: "middle" },
      1: { cellWidth: 41 },
      2: { cellWidth: 41 },
      3: { cellWidth: 41 },
      4: { cellWidth: 41 },
      5: { cellWidth: 41 },
      6: { cellWidth: 41 },
    },
    margin: { left: 12, right: 12 },
  });

  // Footer Signatures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastY = (doc as any).lastAutoTable?.finalY || 160;
  const signatureY = Math.min(lastY + 14, 185);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);

  const col1 = 35;
  const col2 = 100;
  const col3 = 175;
  const col4 = 250;

  doc.text("Deputy Director, Head of SE", col1, signatureY, { align: "center" });
  doc.text("Deputy Director, Head of SN", col2, signatureY, { align: "center" });
  doc.text("Director of Academic Affaires", col3, signatureY, { align: "center" });
  doc.text("Resident Representative", col4, signatureY, { align: "center" });

  // Generation timestamp
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${publishedDate}`, pageWidth / 2, signatureY + 10, { align: "center" });

  return doc;
};

export const downloadTimetablePDF = (options: GeneratePdfOptions) => {
  const doc = createTimetablePDF(options);
  const cleanProgram = (options.program || "Course").replace(/\s+/g, "_");
  const cleanSemester = (options.semester || "Semester").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Official_Timetable_${cleanProgram}_${cleanSemester}.pdf`);
};

export default {
  createTimetablePDF,
  downloadTimetablePDF,
};
