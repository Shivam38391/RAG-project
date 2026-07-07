from datetime import datetime
from pydantic import BaseModel


class ConversationCreate(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True





class ConversationCreateV2(BaseModel):
    workspace_id: int
    title: str


class ConversationResponseV2(BaseModel):
    id: int
    workspace_id: int
    title: str

    class Config:
        from_attributes = True