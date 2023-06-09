import formatTodoForAI from "./formatTodoForAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodoForAI(board);
  console.log("formatted todos to send: ", todos);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todos }),
  });

  const dataGPT = await res.json();
  const { content } = dataGPT;

  return content;
};

export default fetchSuggestion;
