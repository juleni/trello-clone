import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Todos in the body of the POST request
  const { todos } = await request.json();
  console.log(todos);

  // Communicate with openAI GPT
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1, // give only one response back
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome user always as Mr. Juleni and say welcome to the JULENI ToDo App! Limit the response to 200 characters.",
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as ToDo, InProgress and Done. Then tell the user to have a productive day! Here are the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const { data } = response;
  console.log("data = ", data);
  console.log(data.choices[0].message);

  return NextResponse.json(data.choices[0].message);
}
