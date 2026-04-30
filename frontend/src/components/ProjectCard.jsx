import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate(`/projects/${project._id}`)}
        >
          {project.name}
        </h3>
        {isAdmin && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Edit project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((member) => (
            <div
              key={member._id}
              title={member.name}
              className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-700 text-xs font-semibold"
            >
              {member.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-semibold">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
