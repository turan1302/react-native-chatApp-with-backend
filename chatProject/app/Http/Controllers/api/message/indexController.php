<?php

namespace App\Http\Controllers\api\message;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\MessageModel;
use App\Models\User;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function create(Request $request)
    {
        $input = $request->except("_token");

        $control = User::where("token",$input['mg_user'])->first();  // bu kısımdan token gelecek

        if (!$control){
            return parent::sendError("Auth girişi yok");
        }

        $create = MessageModel::create($input);

        if ($create){
            return parent::sendResponse("Mesaj gönderme işlemi başarılı");
        }else{
            return  parent::sendError("Mesaj gönderme işleminde bir hata Oluştu. Lütfen daha sonra tekrar deneyiniz");
        }
    }

    public function list(Request $request)
    {
        $input = $request->except("_token");

        $messages = MessageModel::select("rooms.*","messages.*","users.name")->leftJoin("rooms","rooms.rm_id","=","messages.mg_room")->leftJoin("users","users.token","=","messages.mg_user")->where([
            "messages.mg_room"=>$input['mg_room']
        ])->orderBy("messages.mg_created_at",'asc')->get();

        return parent::sendResponse("",$messages);
    }


}
