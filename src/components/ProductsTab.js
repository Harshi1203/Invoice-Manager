import React from 'react';

const ProductsTab = ({ products }) => {
    return (
        <div>
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
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.qty}</td>
                            <td>{product.unitPrice}</td>
                            <td>{product.tax}</td>
                            <td>{(product.unitPrice * product.qty) + product.tax}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTab;
