import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./viewport.css";
import "./boot-background.css";
import "./photos.css";
import "./activities.css";
import "./commit.css";
import "./documents.css";
import "./sync.css";
import "./culture-photos.css";
import "./typography.css";
import "./mobile.css";
import "./usability.css";
import "./media-dialogs.css";
import "./theme.css";
import "./overview.css";
import "./journey.css";
import "./radius.css";
import "./responsive.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
