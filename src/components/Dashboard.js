import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      try {
        const userInvoicesRef = collection(db, "users", user.uid, "invoices");
        const q = query(userInvoicesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setInvoices(fetched);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const handleCreateInvoice = () => {
    localStorage.removeItem("editingInvoice");
    navigate("/invoice");
  };

  const handleEdit = (invoice) => {
    localStorage.setItem("editingInvoice", JSON.stringify(invoice));
    navigate("/invoice");
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "invoices", invoiceId));
        setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleDownload = async (invoice) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.style.position = "fixed";
    invoiceElement.style.left = "-9999px";
    invoiceElement.style.top = "0";
    invoiceElement.style.width = "800px";
    invoiceElement.style.fontFamily = "Arial";
    invoiceElement.style.padding = "20px";

    invoiceElement.innerHTML = `
      <h2>Invoice: ${invoice.number}</h2>
      <p><strong>Client:</strong> ${invoice.client}</p>
      <p><strong>Date:</strong> ${invoice.date}</p>
      <p><strong>Total:</strong> ₹${invoice.total}</p>
    `;

    document.body.appendChild(invoiceElement);

    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoice.number}.pdf`);
    setTimeout(() =>{
      navigate("/dashboard");
    }, 500);

    document.body.removeChild(invoiceElement);
  };

  const filteredInvoices = invoices.filter((inv) =>
    inv.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome{user?.displayName ? `, ${user.displayName}` : ""}</h1>
        <p>Manage your invoices efficiently.</p>
      </div>

      <button className="create-invoice-btn" onClick={handleCreateInvoice}>
        + Create New Invoice
      </button>

      <div className="dashboard-search" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by client or invoice number..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: "8px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "8px 0 0 8px",
            outline: "none",
            fontSize: "14px"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0 8px 8px 0",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px"
          }}
          aria-label="Search invoices"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="loading">Log in to see your invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="empty-message">No invoices found. Click above to create one.</p>
      ) : (
        <>
          <div className="dashboard-summary">
            <div className="summary-card">
              <FaFileInvoiceDollar className="summary-icon" />
              <h3>{filteredInvoices.length}</h3>
              <p>Total Invoices</p>
            </div>
            <div className="summary-card">
              <FaMoneyBillWave className="summary-icon" />
              <h3>₹{totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.number}</td>
                    <td>{invoice.client}</td>
                    <td>{invoice.date}</td>
                    <td>₹{invoice.total}</td>
                    <td>
                      <button
                        className="dashboard-action-btn"
                        onClick={() => handleEdit(invoice)}
                      >
                        Edit
                      </button>
                      <button
                        className="dashboard-action-btn delete"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="dashboard-action-btn download"
                        onClick={() => handleDownload(invoice)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;