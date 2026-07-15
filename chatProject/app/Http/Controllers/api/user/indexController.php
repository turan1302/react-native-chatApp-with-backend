<?php

namespace App\Http\Controllers\api\user;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function create(Request $request)
    {
        $input = $request->except("_token");

        $control = User::where("email",$input['email'])->first();
        if ($control){
            return parent::sendError("Aynı E-Mail adresi kullanımda");
        }

        $input['token'] = uniqid();
        $create = User::create($input);

        if ($create){
            return parent::sendResponse("Kullanıcı Kaydı Oluşturuldu. Bilgilerinizle Giriş Yapabilirsiniz");
        }else{
            return parent::sendError("Kullanıcı Kaydı Oluşturulurken Bir Hata Oluştu");
        }
    }

    public function login(Request $request)
    {
        $input = $request->except("_token");

        $credentials = [
          "email" => $input['email'],
          "password" => $input['password']
        ];

        if (auth()->attempt($credentials)){
            $result = [
                "name" => auth()->user()->name,
                "token" => auth()->user()->token,
                "isSuper" => auth()->user()->isSuper,
            ];

            return parent::sendResponse("Giriş Başarılı",$result);
        }else{
            return parent::sendError("E-Mail adresi ve/veya şifre hatalı");
        }
    }
}
