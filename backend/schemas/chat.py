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

# Nuevos esquemas para guardar mensajes
class ChatMessageSave(BaseModel):
    user_id: int
    message_type: str  # 'user' o 'ai'
    content: str
    session_id: Optional[str] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    message_type: str
    content: str
    timestamp: datetime
    session_id: Optional[str] = None
    status: int = 1
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ChatSession(BaseModel):
    session_id: str
    user_id: int
    messages: List[ChatMessageResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 