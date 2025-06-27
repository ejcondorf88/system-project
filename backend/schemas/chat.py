from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatMessageBase(BaseModel):
    message: str
    user_id: Optional[int] = None

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    timestamp: datetime
    response: Optional[str] = None
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    message_id: str

class ChatHistory(BaseModel):
    messages: List[ChatMessage]
    total_count: int 