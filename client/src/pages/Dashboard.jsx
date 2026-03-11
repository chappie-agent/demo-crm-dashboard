import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, customersRes, dealsRes] = await Promise.all([
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/customers', { headers }),
          fetch('/api/deals', { headers })
        ]);
        setStats(await statsRes.json());
        setCustomers(await customersRes.json());
        setDeals(await dealsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const getStageClass = (stage) => `status-badge status-${stage}`;

  if (loading) return <div className="main-content">Loading...</div>;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>CRM</h2>
        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Customers</div>
          <div className="nav-item">Deals</div>
          <div className="nav-item">Reports</div>
        </nav>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={logout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <h3>Total Customers</h3>
            <div className="value">{stats?.totalCustomers}</div>
          </div>
          <div className="kpi-card">
            <h3>Active Customers</h3>
            <div className="value">{stats?.activeCustomers}</div>
          </div>
          <div className="kpi-card">
            <h3>Total Revenue</h3>
            <div className="value">{formatCurrency(stats?.totalRevenue)}</div>
          </div>
          <div className="kpi-card">
            <h3>Pipeline Value</h3>
            <div className="value">{formatCurrency(stats?.pipelineValue)}</div>
          </div>
          <div className="kpi-card">
            <h3>Won Deals</h3>
            <div className="value">{stats?.wonDeals}</div>
          </div>
          <div className="kpi-card">
            <h3>Active Leads</h3>
            <div className="value">{stats?.leadCount}</div>
          </div>
        </div>

        <div className="section">
          <h2>Recent Customers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.company}</td>
                  <td>
                    <span className={`status-badge status-${customer.status}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Recent Deals</h2>
          <div className="deals-grid">
            {deals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="deal-item">
                <div className="deal-info">
                  <h4>{deal.title}</h4>
                  <p>{deal.customer_name}</p>
                </div>
                <div className="deal-value">
                  <div className="amount">{formatCurrency(deal.value)}</div>
                  <span className={getStageClass(deal.stage)}>{deal.stage.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
