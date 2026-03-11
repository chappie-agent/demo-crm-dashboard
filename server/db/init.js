import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('crm.db');

db.exec(`
  DROP TABLE IF EXISTS deals;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    value REAL DEFAULT 0,
    stage TEXT DEFAULT 'lead',
    probability INTEGER DEFAULT 0,
    expected_close_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
`);

const hashedPassword = bcrypt.hashSync('password123', 10);
const insertUser = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
insertUser.run('admin', hashedPassword, 'admin@crm.demo');

const insertCustomer = db.prepare(`
  INSERT INTO customers (name, email, phone, company, status) 
  VALUES (?, ?, ?, ?, ?)
`);

const customers = [
  ['Acme Corp', 'contact@acme.com', '555-0101', 'Acme Corporation', 'active'],
  ['TechStart Inc', 'info@techstart.io', '555-0102', 'TechStart', 'active'],
  ['Global Solutions', 'sales@globalsol.com', '555-0103', 'Global Solutions', 'active'],
  ['Innovation Labs', 'hello@innolabs.co', '555-0104', 'Innovation Labs', 'active'],
  ['Future Systems', 'contact@futuresys.com', '555-0105', 'Future Systems', 'active'],
  ['DataFlow Corp', 'team@dataflow.io', '555-0106', 'DataFlow Corp', 'inactive'],
  ['CloudNine Ltd', 'info@cloudnine.co', '555-0107', 'CloudNine Ltd', 'active'],
  ['NextGen Tech', 'sales@nextgentech.com', '555-0108', 'NextGen Tech', 'active'],
];

customers.forEach(c => insertCustomer.run(...c));

const insertDeal = db.prepare(`
  INSERT INTO deals (customer_id, title, value, stage, probability, expected_close_date)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const deals = [
  [1, 'Enterprise License', 50000, 'closed_won', 100, '2026-01-15'],
  [2, 'Startup Package', 15000, 'negotiation', 75, '2026-03-01'],
  [3, 'Consulting Project', 25000, 'proposal', 50, '2026-02-28'],
  [4, 'Annual Support Contract', 12000, 'qualified', 60, '2026-04-15'],
  [5, 'Cloud Migration', 75000, 'lead', 20, '2026-05-30'],
  [1, 'Add-on Services', 8000, 'closed_won', 100, '2026-02-01'],
  [6, 'Pilot Program', 5000, 'lost', 0, '2025-12-15'],
  [7, 'Security Suite', 35000, 'negotiation', 80, '2026-03-15'],
  [8, 'Infrastructure Upgrade', 45000, 'proposal', 40, '2026-04-01'],
  [3, 'Training Program', 10000, 'qualified', 65, '2026-03-20'],
];

deals.forEach(d => insertDeal.run(...d));

console.log('Database initialized with schema and seed data');
console.log('Default admin credentials: admin / password123');
