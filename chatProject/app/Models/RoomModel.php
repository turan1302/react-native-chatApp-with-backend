<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "rooms";
    protected $guarded = [];
    protected $primaryKey = "rm_id";

    public const CREATED_AT = "rm_created_at";
    public const UPDATED_AT = "rm_updated_at";
}
