import { http } from "msw";

export const handlers = [
  http.get("http://localhost:5173/api/example", () => {
    return new Response(JSON.stringify({ message: "Hello from MSW!" }), { status: 200 });
  }),
];
