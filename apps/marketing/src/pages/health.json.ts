import { scaffoldStatus } from "@gen-z/domain";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => Response.json(scaffoldStatus("marketing", "demo"));
