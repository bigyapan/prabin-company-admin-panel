<?php

namespace App\Http\Controllers\api\v1;

use App\Helpers\UploadHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\GrmBrandResource;
use App\Models\GrmBrand;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrmBrandController extends Controller
{

    public $responseRepository;

    /**
     * GrmBrandController constructor.
     */
    public function __construct(ResponseRepository $rr)
    {
        $this->middleware('auth:api')->except(['index', 'show']);
        $this->responseRepository = $rr;

    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return $this->responseRepository->ResponseSuccess(GrmBrandResource::collection(GrmBrand::all()), 'Brands retrieved successfully.',);
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
            $data = $request->all();
            $titleShort = Str::slug(substr($data['title'], 0, 20));

            $data['image'] = UploadHelper::upload('image', $data['image'], $titleShort . '-' . time(), 'storage/images/gautam-rice-mill/brands');

            $grmBrand = GrmBrand::create($data);
            return $this->responseRepository->ResponseSuccess(new GrmBrandResource($grmBrand), 'Brand created successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmBrand $grmBrand
     * @return JsonResponse
     */
    public function show(GrmBrand $grmBrand)
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmBrandResource($grmBrand), 'Brand retrieved successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmBrand $grmBrand
     * @return JsonResponse
     */
    public function update(Request $request, GrmBrand $grmBrand)
    {
        try {
            $data = $request->all();
            if ($data['image'] != null && $data['image'] != '') {
                $titleShort = Str::slug(substr($data['title'], 0, 20));
                $data['image'] = UploadHelper::update('image', $data['image'], $titleShort . '-' . time(), 'storage/images/gautam-rice-mill/brands', $grmBrand->image);
            } else {
                $data['image'] = $grmBrand->image;
            }
            $grmBrand->update($data);
            return $this->responseRepository->ResponseSuccess(new GrmBrandResource($grmBrand), 'Brand updated successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmBrand $grmBrand
     * @return JsonResponse
     */
    public function destroy(GrmBrand $grmBrand)
    {
        try {
            UploadHelper::deleteFile('storage/images/gautam-rice-mill/brands/' . $grmBrand->image);
            $grmBrand->delete();
            return $this->responseRepository->ResponseSuccess($grmBrand, 'Brand deleted successfully.',);
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
