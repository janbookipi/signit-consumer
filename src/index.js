import { createRoot } from "react-dom/client";

import React from "react";

import "src/assets/styles/common.scss";
import "src/assets/styles/tailwind.css";

import "@bookipi/bds/tailwind.css";

import ContentExplorer from "./render/ContentExplorer";

const htmlTag = document.getElementsByTagName("html")[0];
htmlTag.setAttribute("data-theme", "bookipi");

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<ContentExplorer />);
