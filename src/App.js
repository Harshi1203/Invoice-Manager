import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInvoice } from './redux/invoicesSlice';
import { addProduct } from './redux/productsSlice';
import { addCustomer } from './redux/customersSlice';
import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import Tesseract from 'tesseract.js';

const App = () => {
    const dispatch = useDispatch();
    const invoices = useSelector((state) => state.invoices);
    const products = useSelector((state) => state.products);
    const customers = useSelector((state) => state.customers);

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    // Handle File Upload
    const handleFileUpload = (file) => {
        setError('');
        const reader = new FileReader();

        // Handle Excel Files
        if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);

                console.log('Excel Data:', json);
                json.forEach((row) => {
                    dispatch(addInvoice({
                        id: row.SerialNumber,
                        customer: row.CustomerName,
                        product: row.ProductName,
                        qty: row.Qty,
                        tax: row.Tax,
                        total: row.TotalAmount,
                        date: row.Date,
                    }));
                });
            };
            reader.readAsArrayBuffer(file);
        }
        // Handle PDFs
        else if (file.type === "application/pdf") {
            reader.onload = async (e) => {
                try {
                    const pdfDoc = await PDFDocument.load(e.target.result);
                    const text = await extractTextFromPDF(pdfDoc);
                    console.log('Extracted PDF Text:', text);

                    const extractedInvoices = parsePDFText(text);
                    extractedInvoices.forEach((invoice) => {
                        dispatch(addInvoice(invoice));
                    });
                } catch (error) {
                    console.error("PDF processing error:", error);
                    setError('Failed to process PDF file.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
        // Handle Unsupported Files
        else {
            setError('Unsupported file format! Please upload Excel or PDF files.');
        }
    };

    // Extract text from PDF
    const extractTextFromPDF = async (pdfDoc) => {
        let text = "";
        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const pageText = await page.getTextContent();
            text += pageText.items.map((item) => item.str).join(' ');
        }
        return text;
    };

    // Parse extracted PDF text into structured data
    const parsePDFText = (text) => {
        const lines = text.split("\n");
        const data = {};

        lines.forEach((line) => {
            if (line.includes("Serial Number:")) {
                data.serialNumber = line.split(":")[1].trim();
            }
            if (line.includes("Customer:")) {
                data.customerName = line.split(":")[1].trim();
            }
            if (line.includes("Product:")) {
                data.productName = line.split(":")[1].trim();
            }
            if (line.includes("Quantity:")) {
                data.quantity = parseInt(line.split(":")[1].trim(), 10);
            }
            if (line.includes("Unit Price:")) {
                data.unitPrice = parseFloat(line.split(":")[1].trim().replace('$', ''));
            }
            if (line.includes("Tax:")) {
                data.tax = parseFloat(line.split(":")[1].trim().replace('$', ''));
            }
            if (line.includes("Total:")) {
                data.totalAmount = parseFloat(line.split(":")[1].trim().replace('$', ''));
            }
            if (line.includes("Date:")) {
                data.date = line.split(":")[1].trim();
            }
        });

        // Return structured data for the invoice
        return [{
            id: data.serialNumber,
            customer: data.customerName,
            product: data.productName,
            qty: data.quantity,
            tax: data.tax,
            total: data.totalAmount,
            date: data.date,
        }];
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Invoice Manager</h1>

            {/* File Upload Section */}
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx,.xls,.pdf"
                style={{ marginBottom: '10px' }}
            />
            <button
                onClick={() => file && handleFileUpload(file)}
                style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
                Upload File
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Invoices Section */}
            <h2>Invoices</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Customer Name</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Tax</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.customer}</td>
                            <td>{invoice.product}</td>
                            <td>{invoice.qty}</td>
                            <td>{invoice.tax}</td>
                            <td>{invoice.total}</td>
                            <td>{invoice.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Products Section */}
            <h2>Products</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Tax</th>
                        <th>Price with Tax</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unitPrice}</td>
                            <td>{product.tax}</td>
                            <td>{(product.unitPrice + product.tax).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Customers Section */}
            <h2>Customers</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Total Purchase Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.name}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.totalPurchase}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
