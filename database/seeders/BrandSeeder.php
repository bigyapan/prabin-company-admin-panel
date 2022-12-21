<?php

namespace Database\Seeders;

use App\Models\GrmBrand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $brands = [
            [
                'title' => 'Aerogin',
            ],
            [
                'title' => 'Gautam',
            ],
            [
                'title' => 'Seila',
            ]
        ];
        foreach ($brands as $brand) {
            GrmBrand::create($brand);
        }

    }
}
