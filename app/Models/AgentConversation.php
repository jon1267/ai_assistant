<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AgentConversation extends Model
{
    protected $table = 'agent_conversations';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'title',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(AgentConversationMessage::class);
    }
}
