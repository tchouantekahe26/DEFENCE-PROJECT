import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { User, StudentProfile, MarkRecord } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JsPdfConstructor: any = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;

export interface GenerateTranscriptOptions {
  student: User | StudentProfile;
  marks: MarkRecord[];
  semester?: string;
  academicYear?: string;
  issueDate?: string;
}

export const createTranscriptPDF = ({
  student,
  marks,
  semester = "Semester 1",
  academicYear = "2025/2026",
  issueDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
}: GenerateTranscriptOptions): jsPDF => {
  const doc = new JsPdfConstructor({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297 mm

  // Header Border / Institutional Banner
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.line(14, 12, pageWidth - 14, 12);

  // Sub-header top lines (Bilingual Cameroon Official Style)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("REPUBLIC OF CAMEROON", 16, 17);
  doc.text("RÉPUBLIQUE DU CAMEROUN", pageWidth - 16, 17, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Peace – Work – Fatherland", 16, 21);
  doc.text("Paix – Travail – Patrie", pageWidth - 16, 21, { align: "right" });

  // Main Institution Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(30, 41, 59);
  doc.text("INTER-STATES INSTITUTE OF HIGHER EDUCATION", pageWidth / 2, 28, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("PAUL BIYA TECHNOLOGICAL CENTRE OF EXCELLENCE", pageWidth / 2, 33, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Under the auspices of the African Union (AU) • P.O. Box 13 719 Yaounde, Cameroon", pageWidth / 2, 37.5, { align: "center" });
  doc.text("Office of the Registrar • Academic Records & Transcript Service", pageWidth / 2, 41.5, { align: "center" });

  // Document Title Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth / 2 - 45, 46, 90, 8.5, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 45, 46, 90, 8.5, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL ACADEMIC TRANSCRIPT", pageWidth / 2, 51.5, { align: "center" });

  // Student Profile Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 58, pageWidth - 28, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  // Left Column
  doc.text("Student Name:", 18, 64);
  doc.text("Matriculation No:", 18, 70);
  doc.text("Department:", 18, 76);
  doc.text("Class / Group:", 18, 82);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(student.name || "N/A", 50, 64);
  doc.text(student.identifier || "N/A", 50, 70);
  doc.text(student.department || "Computer Science", 50, 76);
  doc.text(student.className || (student as any).level || "BA1A", 50, 82);

  // Right Column
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Academic Year:", 115, 64);
  doc.text("Semester:", 115, 70);
  doc.text("Academic Level:", 115, 76);
  doc.text("Date of Issue:", 115, 82);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(academicYear, 148, 64);
  doc.text(semester, 148, 70);
  doc.text(student.level || "Level 2 (HND 2)", 148, 76);
  doc.text(issueDate, 148, 82);

  // Table Data Preparation
  const tableRows = marks.map((m) => {
    const total = m.totalMark ?? m.courseworkMark + m.examMark;
    const isPassing = total >= 50;
    const weightedPoints = (m.creditHours * (m.gradePoint || 0)).toFixed(1);

    return [
      m.courseCode,
      m.courseTitle,
      m.creditHours.toString(),
      m.courseworkMark ? `${m.courseworkMark}/30` : "-",
      m.examMark ? `${m.examMark}/70` : "-",
      `${total}/100`,
      m.grade || "B",
      (m.gradePoint || 0).toFixed(1),
      weightedPoints,
      isPassing ? "PASSED" : "FAILED",
    ];
  });

  // Calculate Summary Metrics
  const totalCredits = marks.reduce((sum, m) => sum + (m.creditHours || 0), 0);
  const totalQualityPoints = marks.reduce((sum, m) => sum + (m.gradePoint || 0) * (m.creditHours || 0), 0);
  const semesterGpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : "0.00";
  const passedCredits = marks
    .filter((m) => (m.totalMark ?? m.courseworkMark + m.examMark) >= 50)
    .reduce((sum, m) => sum + (m.creditHours || 0), 0);

  autoTable(doc, {
    startY: 90,
    head: [
      [
        "Code",
        "Course Title",
        "Credits",
        "CA (30)",
        "Exam (70)",
        "Total",
        "Grade",
        "GP",
        "W.Pts",
        "Status",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [49, 46, 129], // Deep indigo
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
      valign: "middle",
      minCellHeight: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      valign: "middle",
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 18, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 54 },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 16, halign: "center" },
      5: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      6: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      7: { cellWidth: 12, halign: "center" },
      8: { cellWidth: 14, halign: "center" },
      9: { cellWidth: 18, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 9) {
        if (data.cell.raw === "PASSED") {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [239, 68, 68];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastY = (doc as any).lastAutoTable?.finalY || 160;

  // Academic Summary Box
  const summaryBoxY = lastY + 5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, summaryBoxY, pageWidth - 28, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.text(`Total Credits Attempted: ${totalCredits}`, 20, summaryBoxY + 7);
  doc.text(`Total Credits Earned: ${passedCredits}`, 20, summaryBoxY + 13);
  doc.text(`Total Quality Points: ${totalQualityPoints.toFixed(1)}`, 20, summaryBoxY + 19);

  doc.text(`Semester GPA: ${semesterGpa} / 4.00`, 90, summaryBoxY + 7);
  doc.text(`Cumulative CGPA: ${((student as any).cgpa || semesterGpa)}`, 90, summaryBoxY + 13);
  const statusRemark = parseFloat(semesterGpa) >= 3.5 ? "First Class / Honors" : parseFloat(semesterGpa) >= 3.0 ? "Good Standing" : "Satisfactory";
  doc.text(`Academic Standing: ${statusRemark}`, 90, summaryBoxY + 19);

  // Security & Verification Seal Simulation
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.6);
  doc.circle(175, summaryBoxY + 12, 9, "S");
  doc.setFontSize(5);
  doc.setTextColor(79, 70, 229);
  doc.text("IAI-CAMEROON", 175, summaryBoxY + 9, { align: "center" });
  doc.text("OFFICIAL SEAL", 175, summaryBoxY + 12.5, { align: "center" });
  doc.text("VERIFIED", 175, summaryBoxY + 16, { align: "center" });

  // Grading Scale Legend
  const legendY = summaryBoxY + 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Grading Scale & Equivalencies:", 14, legendY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("A (80-100% / 4.0 GP - Excellent)   B (70-79% / 3.0 GP - Very Good)   C (60-69% / 2.0 GP - Good)   D (50-59% / 1.0 GP - Pass)   F (<50% / 0.0 GP - Fail)", 14, legendY + 4);

  // Signatures Section
  const signatureY = Math.min(legendY + 14, pageHeight - 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Head of Department
  doc.text("Head of Department", 25, signatureY);
  doc.line(20, signatureY + 15, 65, signatureY + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Dr. Academic Director", 25, signatureY + 19);

  // Registrar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Registrar & Records Office", pageWidth - 70, signatureY);
  doc.line(pageWidth - 75, signatureY + 15, pageWidth - 20, signatureY + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Official Institutional Registrar", pageWidth - 70, signatureY + 19);

  // Bottom Notice
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This document is an authentic electronic record issued by UNINEXUS. Tampering or unauthorized alteration renders this transcript null and void.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  return doc;
};

export const downloadTranscriptPDF = (
  options: GenerateTranscriptOptions,
  filename?: string
): void => {
  const doc = createTranscriptPDF(options);
  const matricClean = options.student.identifier?.replace(/[^a-zA-Z0-9]/g, "_") || "student";
  const finalFilename = filename || `Transcript_${matricClean}_${Date.now()}.pdf`;
  doc.save(finalFilename);
};
