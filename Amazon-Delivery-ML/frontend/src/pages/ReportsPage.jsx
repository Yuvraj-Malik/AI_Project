import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { apiService } from "../api/client";

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    apiService.reportSummary().then((response) => setReport(response.data));
  }, []);

  const downloadPdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(16);
    doc.text("Amazon Supply Chain Intelligence - Risk Report", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Risk Summary:", 14, y);
    y += 7;
    Object.entries(report.risk_summary).forEach(([key, value]) => {
      doc.text(`- ${key}: ${value}`, 18, y);
      y += 6;
    });

    y += 4;
    doc.text("Feature Impact:", 14, y);
    y += 7;
    report.feature_impact.forEach((item) => {
      doc.text(`- ${item.feature}: ${item.importance}`, 18, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });

    y += 4;
    doc.text("Class Distribution:", 14, y);
    y += 7;
    Object.entries(report.class_distribution.before_smote).forEach(
      ([key, value]) => {
        doc.text(`Before SMOTE - ${key}: ${value}`, 18, y);
        y += 6;
      },
    );
    Object.entries(report.class_distribution.after_smote).forEach(
      ([key, value]) => {
        doc.text(`After SMOTE - ${key}: ${value}`, 18, y);
        y += 6;
      },
    );

    doc.save("delivery-risk-report.pdf");
  };

  if (!report) {
    return <p className="text-sm text-slate-600">Loading report summary...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Reports</h3>
        <p className="mt-2 text-sm text-slate-600">
          Generate downloadable PDF including risk summary, model summary, and
          feature impact analysis.
        </p>
        <button
          onClick={downloadPdf}
          className="mt-4 rounded-md bg-[#FF9900] px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Download PDF Report
        </button>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold text-slate-900">Risk Summary</h4>
          <div className="mt-3 space-y-2">
            {Object.entries(report.risk_summary).map(([key, value]) => (
              <div
                key={key}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
              >
                {key}: {value}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-semibold text-slate-900">Model Summary</h4>
          <p className="mt-2 text-sm text-slate-700">
            Name: {report.model_summary.name}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Algorithm: {report.model_summary.algorithm}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Classes: {report.model_summary.classes.join(", ")}
          </p>
        </div>
      </section>
    </div>
  );
}
