<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categories
        $programming = Category::create(['name' => 'Programming']);
        $fantasy = Category::create(['name' => 'Fantasy']);
        $detective = Category::create(['name' => 'Detective']);
        $drama = Category::create(['name' => 'Drama']);

        // Books
        $books = [
            [
                'title' => 'The Pragmatic Programmer',
                'author' => 'Dick Grayson',
                'price' => 100,
                'category_id' => $programming->id,
            ],
            [
                'title' => 'The Clean Coder',
                'author' => 'Robert C. Martin',
                'price' => 1200,
                'category_id' => $programming->id,
            ],
            [
                'title' => 'Laravel in Action',
                'author' => 'Nuno Maduro',
                'price' => 500,
                'category_id' => $programming->id,
            ],

            [
                'title' => 'The Lord of the Rings',
                'author' => 'J.R.R. Tolkien',
                'price' => 1500,
                'category_id' => $fantasy->id,
            ],
            [
                'title' => 'The Conjuring',
                'author' => 'James Wan',
                'price' => 1000,
                'category_id' => $fantasy->id,
            ],

            [
                'title' => 'Black Swan',
                'author' => 'Natalie Portman',
                'price' => 75,
                'category_id' => $detective->id,
            ],
            [
                'title' => 'Without Remorse',
                'author' => 'Shila Baker',
                'price' => 120,
                'category_id' => $detective->id,
            ],

            [
                'title' => 'Bad Girls Life',
                'author' => 'Jeremy Robinson',
                'price' => 50,
                'category_id' => $drama->id,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }

    }
}
