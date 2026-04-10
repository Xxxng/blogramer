import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';

// Placeholders for other pages
const Subjects = () => <div className="p-8 bg-slate-800 rounded-xl text-slate-400">주제/키워드 페이지 준비 중...</div>;
const Posts = () => <div className="p-8 bg-slate-800 rounded-xl text-slate-400">발행 관리 페이지 준비 중...</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="posts" element={<Posts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
