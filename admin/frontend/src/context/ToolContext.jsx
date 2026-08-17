import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TOOLS, DEFAULT_TOOL_ID } from "../config/tools";

const STORAGE_KEY = "superadmin_selected_tool";

const ToolContext = createContext(null);

export function ToolProvider({ children }) {
  const [toolId, setToolIdState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return TOOLS.some((t) => t.id === saved) ? saved : DEFAULT_TOOL_ID;
  });

  const setToolId = (id) => {
    setToolIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  // Keep the selected tool in sync with the URL — e.g. a direct visit to
  // /website-checker should switch the sidebar even if a different tool
  // was last selected.
  const location = useLocation();
  useEffect(() => {
    const segment = location.pathname.split("/")[1];
    if (segment && TOOLS.some((t) => t.id === segment) && segment !== toolId) {
      setToolId(segment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const tool = TOOLS.find((t) => t.id === toolId) || TOOLS[0];

  return <ToolContext.Provider value={{ tool, toolId, setToolId, tools: TOOLS }}>{children}</ToolContext.Provider>;
}

export function useTool() {
  const ctx = useContext(ToolContext);
  if (!ctx) throw new Error("useTool must be used within ToolProvider");
  return ctx;
}
