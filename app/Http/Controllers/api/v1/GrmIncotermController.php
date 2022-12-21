<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrmIncotermResource;
use App\Models\GrmIncoterm;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrmIncotermController extends Controller
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
            return $this->responseRepository->ResponseSuccess(GrmIncotermResource::collection(GrmIncoterm::all()), 'Incoterms retrieved successfully.');
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
            $grmIncoterm = GrmIncoterm::create($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmIncotermResource($grmIncoterm), 'Incoterm created successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmIncoterm $grmIncoterm
     * @return JsonResponse
     */
    public function show(GrmIncoterm $grmIncoterm): JsonResponse
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmIncotermResource($grmIncoterm), 'Incoterm retrieved successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmIncoterm $grmIncoterm
     * @return JsonResponse
     */
    public function update(Request $request, GrmIncoterm $grmIncoterm): JsonResponse
    {
        try {
            $grmIncoterm->update($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmIncotermResource($grmIncoterm), 'Incoterm updated successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmIncoterm $grmIncoterm
     * @return JsonResponse
     */
    public function destroy(GrmIncoterm $grmIncoterm): JsonResponse
    {
        try {
            $grmIncoterm->delete();
            return $this->responseRepository->ResponseSuccess($grmIncoterm, 'Incoterm deleted successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
