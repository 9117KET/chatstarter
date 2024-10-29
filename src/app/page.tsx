"use client";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const messages = useQuery(api.functions.message.list);
  const createMessage = useMutation(api.functions.message.create);
  const [input, setInput] = useState("");

  console.log("Messages:", messages); // Debug: Check messages loaded

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting Message:", input); // Debug: Check input value on submit
    createMessage({ sender: "Alice", content: input });
    setInput("");
  };

  return (
    <div>
      {messages?.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
