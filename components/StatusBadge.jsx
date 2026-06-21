import { SAGEMAKER_STATUS } from "@/lib/constants";

export function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case SAGEMAKER_STATUS.IN_SERVICE:
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
      case SAGEMAKER_STATUS.CREATING:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case SAGEMAKER_STATUS.DELETING:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
      case SAGEMAKER_STATUS.STOPPED:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
      default:
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-md text-sm font-medium tracking-wide border ${getStatusStyles()}`}>
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {status === SAGEMAKER_STATUS.IN_SERVICE && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
          {status === SAGEMAKER_STATUS.CREATING && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
             status === SAGEMAKER_STATUS.IN_SERVICE ? 'bg-green-500' :
             status === SAGEMAKER_STATUS.CREATING ? 'bg-blue-500' :
             status === SAGEMAKER_STATUS.DELETING ? 'bg-yellow-500' :
             status === SAGEMAKER_STATUS.STOPPED ? 'bg-zinc-500' : 'bg-red-500'
          }`}></span>
        </span>
        {status}
      </span>
    </span>
  );
}
