import { Shield, BookOpen, Users } from "lucide-react";
import Index from "./pages/Index.jsx";
import Lessons from "./pages/Lessons.jsx";
import About from "./pages/About.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Shield className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Lessons",
    to: "/lessons",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Lessons />,
  },
  {
    title: "About",
    to: "/about",
    icon: <Users className="h-4 w-4" />,
    page: <About />,
  },
];
