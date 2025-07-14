// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  
  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  }, []);

  const handleCreateInvoice = () => {
    localStorage.removeItem("editingInvoice");
    navigate("/invoice");
  };

  const handleEdit = (invoice) => {
    localStorage.setItem("editingInvoice", JSON.stringify(invoice));
    navigate("/invoice");
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updated = [...invoices];
      updated.splice(index, 1);
      localStorage.setItem("invoices", JSON.stringify(updated));
      setInvoices(updated);
    }
  };

  const handleDownload = (invoice) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.innerHTML = `
      <div style="font-family: Arial; padding: 20px">
        <h2>Invoice: ${invoice.number}</h2>
        <p><strong>Client:</strong> ${invoice.client}</p>
        <p><strong>Date:</strong> ${invoice.date}</p>
        <p><strong>Total:</strong> ${invoice.total}</p>
      </div>
    `;

    import("jspdf").then((jsPDF) => {
      import("html2canvas").then((html2canvas) => {
        html2canvas.default(invoiceElement).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF.jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`invoice-${invoice.number}.pdf`);
        });
      });
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button className="create-invoice-btn" onClick={handleCreateInvoice}>
        + Create New Invoice
      </button>

      {invoices.length === 0 ? (
        <p>No invoices found. Click above to create one.</p>
      ) : (
        <table className="Dashboard-table">
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>{invoice.number}</td>
                <td>{invoice.client}</td>
                <td>{invoice.date}</td>
                <td>{invoice.total}</td>
                <td>
                  <button className="dashboard-action-btn" onClick={() => handleEdit(invoice)}>Edit</button>
                  <button className="dashboard-action-btn" onClick={() => handleDelete(index)}>Delete</button>
                  <button className="dashboard-action-btn" onClick={() => handleDownload(invoice)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;