// src/TodoList.js
import React, { useState, useEffect } from 'react';
import './main.css';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [oldTaskName, setOldTaskName] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState('Low');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/results');
        const data = await response.json();
        setTasks(data);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to add this task?')) return;

        const response = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskName, dueDate, priority }),
        });
        const data = await response.json();
        setTasks(data);
        setTaskName('');
        setDueDate('');
    };

    const modifyTask = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to modify this task?')) return;

        const response = await fetch('/modify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldTaskName, newTaskName, dueDate: newDueDate, priority: newPriority }),
        });
        const data = await response.json();
        setTasks(data);
        setOldTaskName('');
        setNewTaskName('');
        setNewDueDate('');
    };

    const deleteTask = async (taskName) => {
        if (!window.confirm(`Are you sure you want to delete the task "${taskName}"?`)) return;

        const response = await fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskName }),
        });
        const data = await response.json();
        setTasks(data);
    };

    return (
        <div>
            <h1>Your Todo List</h1>

            {/* Add Task Form */}
            <form id="addTaskForm" className="form-section" onSubmit={addTask}>
                <input
                    type="text"
                    className="input-field"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Task Name"
                    required
                />
                <input
                    type="date"
                    className="input-field"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <select
                    className="input-field"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button type="submit" className="button-primary">Add Task</button>
            </form>

            {/* Modify Task Form */}
            <form id="modifyTaskForm" className="form-section" onSubmit={modifyTask}>
                <input
                    type="text"
                    className="input-field"
                    value={oldTaskName}
                    onChange={(e) => setOldTaskName(e.target.value)}
                    placeholder="Task to Modify"
                    required
                />
                <input
                    type="text"
                    className="input-field"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="New Task Name"
                    required
                />
                <input
                    type="date"
                    className="input-field"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                />
                <select
                    className="input-field"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button type="submit" className="button-primary">Modify Task</button>
            </form>

            <h2>Current Tasks</h2>
            <table id="taskTable" className="task-table">
                <thead>
                <tr>
                    <th>Task Name</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Days Remaining</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.taskName}>
                        <td>{task.taskName}</td>
                        <td>{task.dueDate}</td>
                        <td>{task.priority}</td>
                        <td>{task.daysRemaining}</td>
                        <td>
                            <button onClick={() => deleteTask(task.taskName)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;
