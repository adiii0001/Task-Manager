import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyTask = {
  title: '', description: '', status: 'todo', priority: 'medium',
  dueDate: '', assignedTo: '', projectId: '',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(null);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        navigate('/projects');
      } else {
        toast.error('Failed to load project');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const openCreateTask = () => {
    setForm({ ...emptyTask, projectId: id });
    setEditingTaskId(null);
    setTaskModal(true);
  };

  const openEditTask = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo?._id || '',
      projectId: id,
    });
    setEditingTaskId(task._id);
    setTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Task title is required'); return; }
    setSaving(true);
    try {
      if (editingTaskId) {
        const { data } = await api.put(`/tasks/${editingTaskId}`, form);
        setTasks((prev) => prev.map((t) => (t._id === editingTaskId ? data : t)));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', form);
        setTasks((prev) => [data, ...prev]);
        toast.success('Task created');
      }
      setTaskModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskModal) return;
    try {
      await api.delete(`/tasks/${deleteTaskModal._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTaskModal._id));
      toast.success('Task deleted');
      setDeleteTaskModal(null);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
      setSelectedTask(data);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  if (!project) return null;

  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
  };

  const columns = [
    { key: 'todo', label: 'Todo', color: 'bg-gray-100 text-gray-700' },
    { key: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Projects
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-500 mt-1">{project.description}</p>
            )}
          </div>
          {isAdmin && (
            <button onClick={openCreateTask} className="btn-primary flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          )}
        </div>

        {/* Members */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Team Members</h3>
          <div className="flex flex-wrap gap-2">
            {project.members?.map((m) => (
              <div key={m._id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{m.name}</span>
                <span className="text-xs text-gray-400 capitalize">{m.role}</span>
              </div>
            ))}
            {project.members?.length === 0 && (
              <p className="text-sm text-gray-400">No members assigned</p>
            )}
          </div>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(({ key, label, color }) => (
            <div key={key} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className={`badge ${color} font-semibold`}>{label}</span>
                <span className="text-sm text-gray-500">{grouped[key].length}</span>
              </div>
              <div className="space-y-3">
                {grouped[key].map((task) => (
                  <div key={task._id} className="relative group">
                    <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                    {isAdmin && (
                      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditTask(task); }}
                          className="p-1 bg-white rounded shadow text-gray-400 hover:text-blue-600"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTaskModal(task); }}
                          className="p-1 bg-white rounded shadow text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {grouped[key].length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={taskModal}
        onClose={() => setTaskModal(false)}
        title={editingTaskId ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="Task title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Task description"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input type="date" className="input" value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Assign To</label>
            <select className="input" value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Unassigned</option>
              {project.members?.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setTaskModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? <LoadingSpinner size="sm" /> : editingTaskId ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details">
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selectedTask.title}</h3>
              {selectedTask.description && (
                <p className="text-gray-600 mt-1 text-sm">{selectedTask.description}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Priority</span><p className="font-medium capitalize">{selectedTask.priority}</p></div>
              <div><span className="text-gray-500">Assigned to</span><p className="font-medium">{selectedTask.assignedTo?.name || '—'}</p></div>
              <div><span className="text-gray-500">Due Date</span>
                <p className="font-medium">{selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'MMM dd, yyyy') : '—'}</p>
              </div>
              <div><span className="text-gray-500">Created by</span><p className="font-medium">{selectedTask.createdBy?.name || '—'}</p></div>
            </div>
            <div>
              <label className="label">Update Status</label>
              <select className="input" value={selectedTask.status}
                onChange={(e) => handleStatusUpdate(selectedTask._id, e.target.value)}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Task Modal */}
      <Modal isOpen={!!deleteTaskModal} onClose={() => setDeleteTaskModal(null)} title="Delete Task" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">Delete task <strong>{deleteTaskModal?.title}</strong>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTaskModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDeleteTask} className="btn-danger flex-1">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ProjectDetail;
