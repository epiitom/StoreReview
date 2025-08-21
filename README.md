<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Store Rating Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f8fafc;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            padding: 2.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #1e293b;
            font-size: 2rem;
            margin-bottom: 0.5rem;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #64748b;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        h2 {
            color: #1e293b;
            font-size: 1.3rem;
            margin: 2rem 0 1rem 0;
            display: flex;
            align-items: center;
        }
        
        h3 {
            color: #475569;
            font-size: 1rem;
            margin: 1.5rem 0 0.5rem 0;
            display: flex;
            align-items: center;
        }
        
        .role-icon {
            margin-right: 0.5rem;
            font-size: 1.2rem;
        }
        
        ul {
            list-style: none;
            padding-left: 1.5rem;
        }
        
        li {
            margin: 0.3rem 0;
            position: relative;
        }
        
        li::before {
            content: "•";
            color: #3b82f6;
            position: absolute;
            left: -1rem;
        }
        
        .tech-stack {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .tech-item {
            background: #f1f5f9;
            padding: 0.8rem;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        
        .tech-item strong {
            color: #1e293b;
        }
        
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
            font-size: 0.9rem;
        }
        
        code {
            font-family: 'Monaco', 'Menlo', monospace;
        }
        
        .setup-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 1rem 0;
        }
        
        .setup-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .setup-card h4 {
            color: #1e293b;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Store Rating Platform</h1>
        <p class="subtitle">Full-stack web app for rating stores with role-based access control</p>
        
        <h2>🎯 Features</h2>
        
        <h3><span class="role-icon">🔑</span>System Admin</h3>
        <ul>
            <li>Add stores, users, and admins</li>
            <li>Analytics dashboard</li>
            <li>Filter and manage data</li>
            <li>User detail views</li>
        </ul>
        
        <h3><span class="role-icon">👤</span>Normal User</h3>
        <ul>
            <li>Sign up / login</li>
            <li>Search stores</li>
            <li>Rate stores (1-5 stars)</li>
            <li>View ratings</li>
        </ul>
        
        <h3><span class="role-icon">🏪</span>Store Owner</h3>
        <ul>
            <li>Login / password update</li>
            <li>View store ratings</li>
            <li>Customer dashboard</li>
        </ul>
        
        <h2>⚡ Tech Stack</h2>
        <div class="tech-stack">
            <div class="tech-item">
                <strong>Frontend:</strong> React + Tailwind CSS
            </div>
            <div class="tech-item">
                <strong>Backend:</strong> Node.js + Express
            </div>
            <div class="tech-item">
                <strong>Database:</strong> PostgreSQL
            </div>
            <div class="tech-item">
                <strong>Auth:</strong> JWT
            </div>
        </div>
        
        <h2>🚀 Quick Start</h2>
        <pre><code># Clone repository
git clone https://github.com/yourusername/StoreReview.git

# Backend setup
cd backend
npm install
cp .env.example .env   # Configure DB + JWT

# Frontend setup  
cd ../frontend
npm install
npm run dev</code></pre>
        
        <h2>⚙️ Environment Setup</h2>
        <p>Create <code>.env</code> in backend folder:</p>
        <pre><code>DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret</code></pre>
        
        <h2>🎉 Usage</h2>
        <div class="setup-grid">
            <div class="setup-card">
                <h4>1. Start Backend</h4>
                <p>Launch the Express server</p>
                <span class="badge">Port: 5000</span>
            </div>
            <div class="setup-card">
                <h4>2. Start Frontend</h4>
                <p>Run the React dev server</p>
                <span class="badge">Port: 3000</span>
            </div>
        </div>
        
        <p style="text-align: center; margin-top: 2rem; color: #64748b;">
            Access your app at <code>http://localhost:3000</code>
        </p>
    </div>
</body>
</html>
