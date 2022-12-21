<?php

namespace Database\Seeders;

use App\Models\GrmContainer;
use Illuminate\Database\Seeder;

class ContainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $containers = [
            [
                'size' => '20',
            ],
            [
                'size' => '40',
            ]
        ];
        foreach ($containers as $container) {
            GrmContainer::create($container);
        }
    }
}
