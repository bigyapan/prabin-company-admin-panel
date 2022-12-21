<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\ResponseRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public $responseRepository;

    /**
     * GrmBrandController constructor.
     */
    public function __construct(ResponseRepository $rr)
    {
        $this->responseRepository = $rr;

    }

    public function login(Request $request)
    {
        try {
            $login = $request->validate([
                'email' => 'required|string',
                'password' => 'required|string'
            ]);

            if (Auth::attempt($login)) {
                $accessToken = auth()->user()->createToken('authToken')->accessToken;
                $data = [
                    'user' => auth()->user(),
                    'accessToken' => $accessToken,
                ];
                return $this->responseRepository->ResponseSuccess($data, 'Login successfully.',);
            } else {
                return $this->responseRepository->ResponseError(null, 'Invalid credentials', 401);
            }
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function register(Request $request)
    {
        try {
            $register = $request->validate([
                'name' => 'required|string',
                'email' => 'email|required|string|unique:users',
                'password' => 'required|string|confirmed|min:8',
            ]);

            $register['password'] = Hash::make($register['password']);

            if (User::create($register)) {
                return $this->responseRepository->ResponseSuccess(null, 'User registered successfully.',);
            } else {
                return $this->responseRepository->ResponseError(null, 'User not registered', 401);
            }
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout(Request $request)
    {
        try {
            $accessToken = $request->user()->token();
            if ($accessToken->revoke()) {
                return $this->responseRepository->ResponseSuccess(null, 'Logout successfully.',);
            } else {
                return $this->responseRepository->ResponseError(null, 'Logout failed', 401);
            }
        } catch (Exception $e) {
            return $this->responseRepository->ResponseError(null, $e->getMessage(), JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
