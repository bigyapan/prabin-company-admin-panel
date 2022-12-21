<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrmContainerResource;
use App\Models\GrmContainer;
use App\Repositories\ResponseRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PHPUnit\Util\Exception;

class GrmContainerController extends Controller
{
    public $responseRepository;

    /**
     * GrmContainerController constructor.
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
            return $this->responseRepository->ResponseSuccess(GrmContainerResource::collection(GrmContainer::all()), 'Containers retrieved successfully.',);
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
            $grmContainer = GrmContainer::create($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmContainerResource($grmContainer), 'Container created successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmContainer $grmContainer
     * @return JsonResponse
     */
    public function show(GrmContainer $grmContainer): JsonResponse
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmContainerResource($grmContainer), 'Container retrieved successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmContainer $grmContainer
     * @return JsonResponse
     */
    public function update(Request $request, GrmContainer $grmContainer): JsonResponse
    {
        try {
            $grmContainer->update($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmContainerResource($grmContainer), 'Container updated successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmContainer $grmContainer
     * @return JsonResponse
     */
    public function destroy(GrmContainer $grmContainer): JsonResponse
    {
        try {
            $grmContainer->delete();
            return $this->responseRepository->ResponseSuccess($grmContainer, 'Container deleted successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
