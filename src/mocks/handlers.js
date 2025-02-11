import { http } from "msw";

// 메모리에 데이터를 저장하기 위한 임시 저장소
const store = {
  annotations: [],
  nodes: [],
};

export const handlers = [
  // 어노테이션 추가 API
  http.post("http://localhost:5173/api/addAnnotation", async ({ request }) => {
    const body = await request.json();
    const newAnnotation = {
      id: crypto.randomUUID(),
      ...body,
    };
    store.annotations.push(newAnnotation);
    return new Response(JSON.stringify(newAnnotation), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // 어노테이션 리스트 조회 API
  http.get("http://localhost:5173/api/getAnnotations", () => {
    return new Response(JSON.stringify(store.annotations), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // 유사 노드 검색 API
  http.get("http://localhost:5173/api/getSimilarNodes", ({ request }) => {
    const url = new URL(request.url);
    const contents = url.searchParams.get("contents");

    // 실제로는 더 복잡한 유사도 검색 로직이 들어가야 하지만,
    // 목업에서는 간단히 모든 노드를 반환
    const similarNodes = store.nodes.filter((node) => node.annotations.some((ann) => ann.contents.includes(contents)));

    return new Response(JSON.stringify({ conceptNodeList: similarNodes }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // 새로운 노드 추가 API
  http.post("http://localhost:5173/api/addNode", async ({ request }) => {
    const body = await request.json();
    const newNode = {
      ...body,
      annotations: body.annotations || [],
      comment: body.comment || "",
      links: body.links || [],
    };

    // node_id의 유니크 체크
    if (store.nodes.some((node) => node.node_id === newNode.node_id)) {
      return new Response(JSON.stringify({ error: "Node ID must be unique" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    store.nodes.push(newNode);
    return new Response(JSON.stringify(newNode), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
