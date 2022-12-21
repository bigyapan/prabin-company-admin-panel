<?php

namespace Database\Seeders;

use App\Models\GrmPackaging;
use Illuminate\Database\Seeder;

class PackagingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $packagings = [
            [
                'title' => '1 Kg - 21 Tons',
            ],
            [
                'title' => '2 Kg - 21 Tons',
            ],
            [
                'title' => '5 Kg - 23 Tons',
            ],
            [
                'title' => '10 Kg - 24 Tons',
            ],
            [
                'title' => '25 Kg - 25 Tons',
            ]
        ];
        foreach ($packagings as $packaging) {
            GrmPackaging::create($packaging);
        }
    }
}
