import { RotateCw } from 'lucide-react';
import Button from '../../common/Button/Button';
import EmptyState from '../../common/EmptyState/EmptyState';
import Loader from '../../common/Loader/Loader';

/** Loading and error states for admin screens that use useAdminData. */
function AdminState({ data, error, onRetry, children }) {
  if (error && !data) {
    return (
      <EmptyState
        title="This did not load."
        text={error.message}
        action={
          <Button variant="ghost" icon={RotateCw} onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!data) return <Loader />;
  return children;
}

export default AdminState;
