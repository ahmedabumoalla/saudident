"use client";
import { useEffect } from "react";
export function usePreloadAssets(paths: string[]) { useEffect(() => { paths.forEach((src) => { const image = new Image(); image.src = src; }); }, [paths]); }
