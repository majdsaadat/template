import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';
import TaskChart from "./assets/BarChart";  

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const addTask = () => {
    if (input.trim() === '') return;
    setTasks([...tasks, { id: Date.now().toString(), text: input, completed: false }]);
    setInput('');
    showNotification('تمت إضافة مهمة جديدة ✅');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    showNotification('تم حذف المهمة ❌');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const deleteAllTasks = () => {
    if (window.confirm('هل أنت متأكد من أنك تريد حذف جميع المهام؟')) {
      setTasks([]);
      showNotification('تم حذف جميع المهام ❌');
    }
  };
  
  const remainingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="outer-container">
      <div className="box">
        <h1 className="title">قائمة المهام</h1>

        {notification && <div className="notification">{notification}</div>}

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="أضف مهمة جديدة"
            className="input"
          />
          <button onClick={addTask} className="add-button">أضف</button>
        </div>

        <div className="filter-container">
          <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>الكل</button>
          <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>مكتملة</button>
          <button onClick={() => setFilter('incomplete')} className={`filter-button ${filter === 'incomplete' ? 'active' : ''}`}>غير مكتملة</button>
          <button onClick={deleteAllTasks} className="delete-all-button">حذف جميع المهام</button>
        </div>

        <p className="remaining-tasks">عدد المهام المتبقية: {remainingTasks}</p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <li
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span
                          onClick={() => toggleComplete(task.id)}
                          onDoubleClick={() => {
                            const newText = prompt('تعديل المهمة:', task.text);
                            if (newText !== null && newText.trim() !== '') {
                              editTask(task.id, newText.trim());
                              showNotification('تم تعديل المهمة ✏️');
                            }
                          }}
                          className={`task-text ${task.completed ? 'completed' : ''}`}
                        >
                          {task.text}
                        </span>
                        <button onClick={() => deleteTask(task.id)} className="delete-button">
                          حذف
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <TaskChart tasks={tasks} />
    </div>
  );
}

export default App;
