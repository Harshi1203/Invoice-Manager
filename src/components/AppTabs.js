import React from 'react';

const AppTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('invoices')} style={tabStyle(activeTab, 'invoices')}>Invoices</button>
            <button onClick={() => setActiveTab('products')} style={tabStyle(activeTab, 'products')}>Products</button>
            <button onClick={() => setActiveTab('customers')} style={tabStyle(activeTab, 'customers')}>Customers</button>
        </div>
    );
};

const tabStyle = (activeTab, tabName) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tabName ? '#ddd' : '#fff',
    border: '1px solid #ccc',
    margin: '0 5px'
});

export default AppTabs;
