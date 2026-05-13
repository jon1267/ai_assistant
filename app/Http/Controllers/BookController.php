<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Book;
use App\Ai\Agents\BookFinderAgent;

class BookController extends Controller
{
    public function search(Request $request)
    {
        $queryText = $request->input('query');
        $conversationId = $request->session()->get('chat_conversation_id', (string) Str::uuid());
        $request->session()->put('chat_conversation_id', $conversationId);

        // Prompt te AI Agent
        $response = BookFinderAgent::make(
            user: $request->user(),
            conversationId: $conversationId,
        )->prompt(
            $queryText,
            provider: 'gemini', // 'openrouter' 'gemini'
            model: 'openai/gpt-4o-mini'
        );

        return response()->json([
            'response' => (string) $response,
            'user_query' => $queryText,
        ]);
    }
}
