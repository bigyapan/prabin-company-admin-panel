<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrmQuote extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function brand()
    {
        return $this->belongsTo(GrmBrand::class, 'brand_id');
    }

    public function incoterm()
    {
        return $this->belongsTo(GrmIncoterm::class, 'incoterm_id');
    }

    public function packaging()
    {
        return $this->belongsTo(GrmPackaging::class, 'packaging_id');
    }

    public function container()
    {
        return $this->belongsTo(GrmContainer::class, 'container_id');
    }

}
