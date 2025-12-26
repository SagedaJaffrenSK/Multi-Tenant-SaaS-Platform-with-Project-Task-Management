import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { getMe, getProjects } from "../api/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadData() {
      const me = await getMe();
      const projectRes = await getProjects();

      const projectsList = projectRes.data.projects || [];

      let totalTasks = 0;
      let completedTasks = 0;

      projectsList.forEach(p => {
        totalTasks += p.taskCount;
        completedTasks += p.completedTaskCount;
      });

      setStats({
        totalProjects: projectsList.length,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
      });

      setProjects(projectsList);
    }

    loadData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard">
        {/* Stats */}
        <div className="stats-grid">
          <StatCard label="Total Projects" value={stats.totalProjects} />
          <StatCard label="Total Tasks" value={stats.totalTasks} />
          <StatCard label="Completed Tasks" value={stats.completedTasks} />
          <StatCard label="Pending Tasks" value={stats.pendingTasks} />
        </div>

        {/* Recent Projects */}
        <section>
          <h3>Recent Projects</h3>
          {projects.map(p => (
            <div key={p.id} className="list-item">
              <strong>{p.name}</strong>
              <span>{p.status}</span>
              <span>{p.taskCount} tasks</span>
            </div>
          ))}
        </section>

        {/* My Tasks placeholder */}
        <section>
          <h3>My Tasks</h3>
          <p>Task list will appear here</p>
        </section>
      </div>
    </>
  );
}

export default function Dashboard() {
  return <h2>Welcome to Dashboard</h2>;
}
