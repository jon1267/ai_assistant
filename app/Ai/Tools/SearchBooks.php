<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;
use App\Models\Book;

class SearchBooks implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Search the book shop for books by author, category or title, including filtering by price. .';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $query = Book::query()->with('category');

        if ($author = $request['author'] ?? null) {
            $query->where('author', 'LIKE' , "%$author%");
        }

        if ($category =  $request['category'] ?? null) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('name', 'LIKE' , "%$category%");
            });
        }

        if ($max_price = $request['max_price'] ?? null) {
            $query->where('price','<=' , $max_price);
        }

        if ($q = $request['query'] ?? null) {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'LIKE', "%$q%")
                    ->orWhere('author', 'LIKE', "%$q%");
            });
        }

        $books = $query->limit(10)->get();

        if ($books->isEmpty()) {
            return 'No books found matching your criteria.';
        }

        return $books->map(function ($book) {
            return sprintf("-%s by %s (%s)  -%s",
                    $book->title,
                    $book->author,
                    $book->category->name,
                    $book->price);
        })->implode("\n");
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            //'value' => $schema->string()->required(),
            'author' => $schema->string()->nullable(),
            'category' => $schema->string()->nullable(),
            'max_price' => $schema->number()->nullable(),
            'query' => $schema->string()->nullable()->description('Search term  for title or authors'),
        ];
    }
}
