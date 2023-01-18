<?php

namespace App\Http\Controllers\api\v1;

use App\Helpers\CollectionHelper;
use App\Helpers\UploadHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\GrmQuoteResource;
use App\Models\GrmBrand;
use App\Models\GrmQuote;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrmQuoteController extends Controller
{
    public $responseRepository;

    /**
     * GrmQuoteController constructor.
     */
    public function __construct(ResponseRepository $rr)
    {
        $this->middleware('auth:api')->except(['store']);
        $this->responseRepository = $rr;
    }
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            return $this->responseRepository->ResponseSuccess(GrmQuoteResource::make(CollectionHelper::getData($request,GrmQuote::class,['brand', 'incoterm', 'packaging', 'container'])), 'Quotes retrieved successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->except(['custom_brand_title', 'custom_brand_image', 'is_customer']);
            if ($data['brand_id'] == 0) {
                if ($request['is_customer']) {
                    $temp = [
                        'title' => $request['custom_brand_title'],
                        'image' => $request['custom_brand_image'],
                        'is_customer' => $request['is_customer'],
                    ];
                } else {
                    $temp = [
                        'title' => $request['custom_brand_title'],
                        'image' => $request['custom_brand_image'],
                    ];
                }

                $titleShort = Str::slug(substr($temp['title'], 0, 20));
                $temp['image'] = UploadHelper::upload('custom_brand_image', $request['custom_brand_image'], $titleShort . '-' . time(), 'storage/images/gautam-rice-mill/brands');
                $data['brand_id'] = GrmBrand::create($temp)->id;
            }
            $grmQuote = GrmQuote::create($data);
            return $this->responseRepository->ResponseSuccess(new GrmQuoteResource($grmQuote), 'Quote created successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmQuote $grmQuote
     * @return JsonResponse
     */
    public function show(GrmQuote $grmQuote)
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmQuoteResource($grmQuote->load('brand', 'incoterm', 'packaging', 'container')), 'Quote retrieved successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmQuote $grmQuote
     * @return JsonResponse
     */
    public function update(Request $request, GrmQuote $grmQuote)
    {
        try {
            $grmQuote->update($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmQuoteResource($grmQuote), 'Quote updated successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmQuote $grmQuote
     * @return JsonResponse
     */
    public function destroy(GrmQuote $grmQuote)
    {
        try {
            $grmQuote->delete();
            return $this->responseRepository->ResponseSuccess($grmQuote, 'Quote deleted successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
