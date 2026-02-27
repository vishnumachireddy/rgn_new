import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/20 bg-card/30 py-12">
    <div className="container mx-auto flex flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-between md:text-left">
      <Link to="/" className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-secondary" />
        <span className="font-display text-lg font-bold text-foreground">
          AgroSmart <span className="text-accent">AI</span>
        </span>
      </Link>
      <p className="font-body text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgroSmart AI. Intelligent Farming for the Future.
      </p>
    </div>
  </footer>
);

export default Footer;
