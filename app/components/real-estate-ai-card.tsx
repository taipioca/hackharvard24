"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send } from "lucide-react";

export function RealEstateAiCard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: getAIResponse(input) },
        ]);
      }, 1000);
      setInput("");
    }
  };

  const getAIResponse = (question: string) => {
    const responses = {
      market:
        "The real estate market is currently experiencing steady growth in most urban areas, with a slight cooling in some suburban markets.",
      mortgage:
        "Current mortgage rates are averaging around 3.5% for a 30-year fixed-rate mortgage, but this can vary based on your credit score and loan terms.",
      investment:
        "Real estate investment can be a good way to diversify your portfolio. Popular options include rental properties, REITs, and house flipping.",
      default:
        "I'm sorry, I don't have specific information about that. Could you try asking about the current market, mortgage rates, or investment strategies?",
    };

    const lowercaseQuestion = question.toLowerCase();
    if (lowercaseQuestion.includes("market")) return responses.market;
    if (lowercaseQuestion.includes("mortgage")) return responses.mortgage;
    if (lowercaseQuestion.includes("invest")) return responses.investment;
    return responses.default;
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 shadow-lg">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Real Estate AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] w-full px-4 py-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "ai" ? "text-blue-700" : "text-gray-800"
              }`}
            >
              <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
              {message.content}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask a real estate question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500"
          />
          <Button
            type="submit"
            variant="secondary"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
