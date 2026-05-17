import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="tripnest-footer">
      <div className="f-info-social">
        <i className="fa-brands fa-square-facebook"></i>
        <i className="fa-brands fa-square-instagram"></i>
        <i className="fa-brands fa-square-whatsapp"></i>
      </div>
      <div style={{ width: '100%' }}>
        &copy; TripNest Private Limited
      </div>
      <div className="f-info-dev">Developed by Chaitany Bhute</div>
      <div className="f-info-links">
        <Link to="/privacy">Privacy</Link>
        &nbsp;&amp;&nbsp;
        <Link to="/terms">Terms</Link>
      </div>
    </footer>
  );
}
