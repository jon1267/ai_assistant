<?php

namespace App\Ai\Agents;

use App\Models\User;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

class BookFinderAgent implements Agent, Conversational, HasTools
{
    use Promptable;

    public function __construct(
        public ?User $user = null,
        public ?string $conversationId = null,
    ) {
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
            You are a smart and friendly book shop assistant.
            You help users find books from our database.'
            
            Our database contains:
            - Books (title, author, price)
            - Categories (each book belongs to a category)
            
            You job is to understand user queries and extract:
            - author (if mentioned)
            - category (if mentioned)
            - max_price (if user mentions budget like "under 1000")
            
            Rules:
            - Always focus on books available in our database
            - Keep your responses short and helpful
            - Mention book title, author, and price when suggesting
            
            If the user asks something unrelated:
            - Do not answer that question
            - Politely bring them back to books
            
            Example:
            User: "Whats the weather in London?"
            You: "I can help you find books. What kind of book are you looking for?"
            
            User: Teach me Laravel"
            You: "I can suggest / recommend Laravel books for you."
            
            If the user gives a vague request:
            - Asks a follow-up question related to books
            
            Example:
            "What kind of books do you prefer? Author, category, or budget?"
            
            Important:
            - Never go off-topic
            - Always guide the user back to books
        PROMPT;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }
}
