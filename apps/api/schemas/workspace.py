from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True




class DocumentResponse(BaseModel):
    id: int
    filename: str

    class Config:
        from_attributes = True