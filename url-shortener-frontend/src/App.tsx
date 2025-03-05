import ShortenForm from "./components/ShortenForm";
import UrlStats from "./components/UrlStats";
import "./index.css";

function App() {
  return (
    <div className="container">
      <h1>🚀 URL Shortener</h1>
      <ShortenForm />
      <UrlStats />
    </div>
  );
}

export default App;
