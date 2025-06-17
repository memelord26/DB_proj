// app/login/layout.js
import './style.module.css'; // This will include your :global scoped CSS

export default function LoginLayout({ children }) {
  return (
    <div className="pageWrapper">
      {children}
    </div>
  );
}
