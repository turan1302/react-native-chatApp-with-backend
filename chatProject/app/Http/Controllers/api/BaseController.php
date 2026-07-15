<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function sendResponse($message="",$data = [])
    {
        $result = [
            "success" => true,
            "message" => $message,
            "data" => $data
        ];

        return response()->json($result);
    }

    public function sendError($message="",$errorData="")
    {
        $result = [
            "success" => false,
            "message" => $message,
        ];

        if (!empty($errorData)){
            $result["data"] = $errorData;
        }

        return response()->json($result);
    }
}
