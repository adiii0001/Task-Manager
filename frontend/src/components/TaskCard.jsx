import { format } from 'date-fns';

const statusColors = {
  todo: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const TaskCard = ({ task, onClick }) => {
  const isOverdue = task.isOverdue;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-md transition-shadow ${
        isOverdue ? 'border-l-4 border-red-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <span className={`badge ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className={`badge ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ')}
        </span>

        {task.dueDate && (
          <span className={`text-gray-500 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>

      {task.assignedTo && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
            {task.assignedTo.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-600">{task.assignedTo.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
