import { useAuth } from '../context/AuthContext';

export default function FlashMessage() {
  const { flash } = useAuth();

  if (!flash.message) return null;

  const alertClass = flash.type === 'success'
    ? 'alert-success'
    : 'alert-danger';

  return (
    <div className="flash-container">
      <div className={`alert ${alertClass} alert-dismissible shadow-sm`} role="alert">
        <i className={`fa-solid ${flash.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2`}></i>
        {flash.message}
      </div>
    </div>
  );
}
