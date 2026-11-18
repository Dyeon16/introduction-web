import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Spec from './pages/Spec.jsx';
import Project from './pages/Project.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/spec" element={<Spec />} />
        <Route path="/project" element={<Project />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
