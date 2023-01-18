<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Models\GrmBrand;
use App\Models\GrmContainer;
use App\Models\GrmIncoterm;
use App\Models\GrmPackaging;
use App\Repositories\ResponseRepository;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public $responseRepository;

    /**
     * GrmQuoteController constructor.
     */
    public function __construct(ResponseRepository $rr)
    {
        $this->responseRepository = $rr;
    }

    public function getResources(Request $request)
    {
        $brands = GrmBrand::all();
        $containers = GrmContainer::all();
        $incoterms = GrmIncoterm::all();
        $packagings = GrmPackaging::all();
        return $this->responseRepository->ResponseSuccess([
            'brands' => $brands,
            'containers' => $containers,
            'incoterms' => $incoterms,
            'packagings' => $packagings
        ], 'Resources retrieved successfully.');
    }
}
