import React, { useState, useEffect } from "react";  
import "./InvoiceForm.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";


function InvoiceForm() {
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [billTo, setBillTo] = useState({ name: "", contact: "" });
  const [paymentInfo, setPaymentInfo] = useState({
    title: "Payment Information",
    studio: "",
    bank: "",
    account: "",
  });
  const [senderInfo, setSenderInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [items, setItems] = useState([{ qty: "", description: "", price: "" }]);
  const [discount, setDiscount] = useState(0);
  const { user } = useAuth();
  useEffect(()=> {
    const existing = localStorage.getItem("editingInvoice");
    if (existing) {
      const data = JSON.parse(existing);
      setInvoiceNumber(data.number || "");
      setInvoiceDate(data.date || "");
      setBillTo({name: data.client || "", contact: data.contact || ""});
      setItems(data.items || [{qty: "", description:"", price: ""}]);
      setSenderInfo(data.senderInfo || {
        name: "",
        address: "",
        phone: "",
        email: "",
      });
      setPaymentInfo(data.paymentInfo || {
        title: "Payment Information",
        studio: "",
        bank: "",
        account: "",
      });
      setDiscount(data.discount || 0);
      localStorage.removeItem("editingInvoice");
    }
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "description" ? value : parseFloat(value) || 0;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { qty: "", description: "", price: "" }]);
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst - discount;

  const downloadPDF = async () => {
    // Basic validation to prevent saving empty invoice
    if (
      !invoiceNumber ||
      !billTo.name ||
      !items.some(item => item.description && item.qty && item.price)
    ) {
      alert("❌ Please complete the invoice before downloading.");
      return;
    }
  
    const element = document.getElementById("invoice");
  
    const elementsToHide = element.querySelectorAll(".no-print");
    elementsToHide.forEach((el) => (el.style.display = "none"));
  
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, scrollY: -window.scrollY });
    const thankYouMessage = document.createElement("div");
    thankYouMessage.innerHTML = `
    <hr />
    <p style="text-align: center; margin-top: 20px;">
    Thank you for your business${user?.displayName ? ", " + user.displayName : ""}!<br/>
    For any queries, contact: ${senderInfo.email || "your.email@example.com"}
    </p>
   `;
   element.appendChild(thankYouMessage);
  
    elementsToHide.forEach((el) => (el.style.display = ""));
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    const invoiceData = {
      number: invoiceNumber,
      client: billTo.name,
      contact: billTo.contact,
      date: invoiceDate,
      total: total.toFixed(2),
      items,
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      discount,
      senderInfo,
      paymentInfo,
      createdAt: Timestamp.now()
    };
  
    const existingInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    existingInvoices.push(invoiceData);
    localStorage.setItem("invoices", JSON.stringify(existingInvoices));
  
    try {
      if (user) {
        const userInvoicesRef = collection(db, "users", user.uid, "invoices");
        await addDoc(userInvoicesRef, invoiceData);
        alert("✅ Invoice saved to dashboard & local storage!");
      }
    } catch (error) {
      console.error("❌ Error saving invoice to Firestore:", error);
      alert("Invoice saved locally, but Firestore failed.");
    }

  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceNumber || "download"}.pdf`);
    element.removeChild(thankYouMessage);
  };
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice-container" id="invoice">
      <div className="header">
        <div className="left">
          <label className="header-label">
            Date:
            <input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="header-input"
            />
          </label>
          <label className="header-label">
            Invoice No.:
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="header-input"
            />
          </label>
        </div>
        <h1>Invoice</h1>
      </div>

      <div className="bill-to">
        <h3>Bill To:</h3>
        <input
          type="text"
          value={billTo.name}
          onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
          placeholder="Enter client name"
        />
        <input
          type="text"
          value={billTo.contact}
          onChange={(e) => setBillTo({ ...billTo, contact: e.target.value })}
          placeholder="Enter phone or email"
        />
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th className="no-print"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  className="table-input"
                />
              </td>
              <td>₹{(item.qty * item.price).toFixed(2)}</td>
              <td className="no-print">
                <button onClick={() => removeItem(index)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className="add-btn no-print">
        + Add Item
      </button>

      <div className="summary">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>CGST (9%): ₹{cgst.toFixed(2)}</p>
        <p>SGST (9%): ₹{sgst.toFixed(2)}</p>
        <p>
          Discount:
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="summary-input"
          />
        </p>
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>

      <div className="footer">
        <div>
          <input
            type="text"
            placeholder="Payment Info Title"
            value={paymentInfo.title}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, title: e.target.value })}
            className="footer-input"
          />
          <input
            type="text"
            placeholder="Studio / Company Name"
            value={paymentInfo.studio}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, studio: e.target.value })}
            className="footer-input"
          />
          <input
            type="text"
            placeholder="Bank Name"
            value={paymentInfo.bank}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, bank: e.target.value })}
            className="footer-input"
          />
          <input
            type="text"
            placeholder="Account Number"
            value={paymentInfo.account}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, account: e.target.value })}
            className="footer-input"
          />
        </div>
        <div>
          <h4>Sender Details</h4>
          <input
            type="text"
            placeholder="Your Name"
            value={senderInfo.name}
            onChange={(e) => setSenderInfo({ ...senderInfo, name: e.target.value })}
            className="footer-input"
          />
          <input
            type="text"
            placeholder="Your Address"
            value={senderInfo.address}
            onChange={(e) => setSenderInfo({ ...senderInfo, address: e.target.value })}
            className="footer-input"
          />
          <input
            type="text"
            placeholder="Your Phone"
            value={senderInfo.phone}
            onChange={(e) => setSenderInfo({ ...senderInfo, phone: e.target.value })}
            className="footer-input"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={senderInfo.email}
            onChange={(e) => setSenderInfo({ ...senderInfo, email: e.target.value })}
            className="footer-input"
          />
        </div>
      </div>

      <div className="invoice-actions no-print">
        <button onClick={downloadPDF}>Download as PDF</button>
        <button onClick={printInvoice}>Print Invoice</button>
      </div>
    </div>
  );
}

export default InvoiceForm;