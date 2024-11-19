import React from 'react';

const InvoicesTab = ({ invoices }) => {
    return (
        <div>
            <h2>Invoices</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Customer</th>
                        <th>Product</th>
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
        </div>
    );
};

export default InvoicesTab;
