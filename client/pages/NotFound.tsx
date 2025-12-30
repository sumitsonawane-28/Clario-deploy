import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text mb-4">
            404
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-slate-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been removed or the URL might be incorrect.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
