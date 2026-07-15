<?php

namespace App\Http\Controllers\api\room;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\MessageModel;
use App\Models\RoomModel;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function create(Request $request)
    {
        $input = $request->except("_token");

        $control = RoomModel::where("rm_name", $input['rm_name'])->first();
        if ($control) {
            return parent::sendError("Aynı oda zaten mevcut");
        }
        $result = RoomModel::create($input);

        if ($result) {
            return parent::sendResponse("Oda ekleme işlemi başarılı",$result);
        } else {
            return parent::sendError("Oda ekleme işlemi başarısız");
        }
    }

    public function list()
    {
        $data = RoomModel::leftJoin("users","users.token","=","rooms.rm_user")->get();
        return parent::sendResponse("",$data);
    }

    public function delete(Request $request)
    {
        $input = $request->except("_token");
        $control = RoomModel::where("rm_id",$input['rm_id'])->first();

        if (!$control){
            return parent::sendError("Oda bulunamadı");
        }

        $message_remove = MessageModel::where("mg_room",$input['rm_id'])->delete();
        $room_remove = RoomModel::where("rm_id",$input['rm_id'])->delete();

        if ($message_remove && $room_remove){
            return parent::sendResponse("İşlem Başarılı");
        }else{
            return parent::sendError("İşlem Başarısız");
        }
    }
}
