import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function TaskChart({ tasks }) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  const data = [
    { name: "مكتملة", tasks: completedTasks },
    { name: "غير مكتملة", tasks: incompleteTasks }
  ];

  return (
    <div className="chart-container" style={{ width: "80%", height: "300px", marginTop: "20px", marginLeft: "40px", marginRight: "40px" }}>
      <h3>الرسم البياني للمهام</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TaskChart;
