<?php

namespace Database\Seeders;

use App\Models\GrmBrand;
use App\Models\GrmIncoterm;
use Illuminate\Database\Seeder;

class IncotermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $incoterms = [
            [
                'title' => 'FDB',
            ],
            [
                'title' => 'CIF',
            ],
            [
                'title' => 'With Delivery',
            ]
        ];
        foreach ($incoterms as $incoterm) {
            GrmIncoterm::create($incoterm);
        }
    }
}
