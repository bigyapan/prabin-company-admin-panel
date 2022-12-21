<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            ['name' => 'Ajeeb Rimal',
                'email' => 'er.ajeebrimal@gmail.com',
                'password' => Hash::make('password')],
            ['name' => 'Bigyapan Inc',
                'email' => 'bigyapan.com@gmail.com',
                'password' => Hash::make('!@big8963')]
        ];
        foreach ($users as $user) {
            User::create($user);
        }

        Artisan::call('passport:install');
    }
}
