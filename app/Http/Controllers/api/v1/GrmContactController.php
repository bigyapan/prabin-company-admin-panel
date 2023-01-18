<?php

namespace App\Http\Controllers\api\v1;

use App\Helpers\CollectionHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\GrmContactResource;
use App\Models\GrmContact;
use App\Models\GrmIncoterm;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GrmContactController extends Controller
{
    public $responseRepository;

    /**
     * GrmContactController constructor.
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
    public function index(Request $request)
    {
        try {
            return $this->responseRepository->ResponseSuccess(GrmContactResource::make(CollectionHelper::getData($request,GrmContact::class)), 'Contacts retrieved successfully.');
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
    public function store(Request $request)
    {
        try {
            $grmContact = GrmContact::create($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmContactResource($grmContact), 'Contact created successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param GrmContact $grmContact
     * @return JsonResponse
     */
    public function show(GrmContact $grmContact)
    {
        try {
            return $this->responseRepository->ResponseSuccess(new GrmContactResource($grmContact), 'Contact retrieved successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param GrmContact $grmContact
     * @return JsonResponse
     */
    public function update(Request $request, GrmContact $grmContact)
    {
        try {
            $grmContact->update($request->all());
            return $this->responseRepository->ResponseSuccess(new GrmContactResource($grmContact), 'Contact updated successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param GrmContact $grmContact
     * @return JsonResponse
     */
    public function destroy(GrmContact $grmContact)
    {
        try {
            $grmContact->delete();
            return $this->responseRepository->ResponseSuccess($grmContact, 'Contact deleted successfully.');
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
