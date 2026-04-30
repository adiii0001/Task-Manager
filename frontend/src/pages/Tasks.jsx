import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', projectId: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '', projectId: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.projectId) params.append('projectId', filters.projectId);

      const [tasksRes, projRes] = await Promise.all([
        api.get(`/tasks?${params}`),
        api.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projRes.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {}
  };

  useEffect(() => { fetchData(); fetchUsers(); }, [filters]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingTaskId(null);
    setTaskModal(true);
  };

  const openEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo?._id || '',
      projectId: task.project?._id || '',
    });
    setEditingTaskId(task._id);
    setTaskModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.projectId) { toast.error('Project is required'); return; }
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

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/tasks/${deleteModal._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== deleteModal._id));
      toast.success('Task deleted');
      setDeleteModal(null);
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

  // Get members for selected project in form
  const selectedProject = projects.find((p) => p._id === form.projectId);
  const assignableUsers = isAdmin
    ? (selectedProject?.members || [])
    : [];

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select className="input w-auto text-sm" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="input w-auto text-sm" value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="input w-auto text-sm" value={filters.projectId}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}>
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {(filters.status || filters.priority || filters.projectId) && (
            <button onClick={() => setFilters({ status: '', priority: '', projectId: '' })}
              className="btn-ghost text-sm">Clear filters</button>
          )}
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="card text-center py-16">
            <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-gray-500 font-medium">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task._id} className="relative group">
                <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                {isAdmin && (
                  <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                      className="p-1.5 bg-white rounded-lg shadow text-gray-400 hover:text-blue-600 border border-gray-100">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteModal(task); }}
                      className="p-1.5 bg-white rounded-lg shadow text-gray-400 hover:text-red-600 border border-gray-100">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title={editingTaskId ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="Task title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Project *</label>
            <select className="input" value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value, assignedTo: '' })}>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
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
          {form.projectId && (
            <div>
              <label className="label">Assign To</label>
              <select className="input" value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {assignableUsers.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
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
              {selectedTask.description && <p className="text-gray-600 mt-1 text-sm">{selectedTask.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Project</span><p className="font-medium">{selectedTask.project?.name || '—'}</p></div>
              <div><span className="text-gray-500">Priority</span><p className="font-medium capitalize">{selectedTask.priority}</p></div>
              <div><span className="text-gray-500">Due Date</span>
                <p className={`font-medium ${selectedTask.isOverdue ? 'text-red-600' : ''}`}>
                  {selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'MMM dd, yyyy') : '—'}
                  {selectedTask.isOverdue && ' (Overdue)'}
                </p>
              </div>
              <div><span className="text-gray-500">Assigned to</span><p className="font-medium">{selectedTask.assignedTo?.name || '—'}</p></div>
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

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Task" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">Delete <strong>{deleteModal?.title}</strong>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Tasks;
