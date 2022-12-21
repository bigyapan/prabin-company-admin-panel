<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrmPackagingResource;
use App\Models\GrmPackaging;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrmPackagingController extends Controller
{

    public $responseRepository;

    /**
     * GrmIncotermController constructor.
     */
    public function __construct(ResponseRepository $rr)
    {
        $this->middleware('auth:api')->except(['index']);
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
            return $this->responseRepository->ResponseSuccess(GrmPackagingResource::collection(GrmPackaging::all()), 'Packaging retrieved successfully.');
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
            $grmPackaging = GrmPackaging::create($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmPackagingResource($grmPackaging), 'Packaging created successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmPackaging $grmPackaging
     * @return JsonResponse
     */
    public function show(GrmPackaging $grmPackaging): JsonResponse
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmPackagingResource($grmPackaging), 'Packaging retrieved successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmPackaging $grmPackaging
     * @return JsonResponse
     */
    public function update(Request $request, GrmPackaging $grmPackaging): JsonResponse
    {
        try {
            $grmPackaging->update($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmPackagingResource($grmPackaging), 'Packaging updated successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmPackaging $grmPackaging
     * @return JsonResponse
     */
    public function destroy(GrmPackaging $grmPackaging): JsonResponse
    {
        try {
            $grmPackaging->delete();
            return $this->responseRepository->ResponseSuccess($grmPackaging, 'Packaging deleted successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
