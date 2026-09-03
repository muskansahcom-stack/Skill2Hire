"use client";

import React from "react";
import { MermaidDiagram, MermaidDiagramProps } from "@/components/learning/MermaidDiagram";

export interface MermaidViewerProps extends MermaidDiagramProps {}

export function MermaidViewer(props: MermaidViewerProps) {
  return <MermaidDiagram {...props} />;
}

export default MermaidViewer;
