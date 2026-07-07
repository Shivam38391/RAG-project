from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from apps.api.db.database import get_db
from apps.api.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceResponse,
    DocumentResponse
)

from apps.api.services.workspace_document_service import WorkspaceDocumentService
from apps.api.services.workspace_service import (
    WorkspaceService,
)

router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"],
)


@router.post(
    "",
    response_model=WorkspaceResponse,
)
def create_workspace(
    request: WorkspaceCreate,
    db: Session = Depends(get_db),
):

    return WorkspaceService.create_workspace(
        db=db,
        name=request.name,
    )


@router.get(
    "",
    response_model=list[WorkspaceResponse],
)
def get_workspaces(
    db: Session = Depends(get_db),
):

    return WorkspaceService.get_workspaces(
        db
    )



@router.get(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
)
def get_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
):
    return WorkspaceService.get_workspace(
        db,
        workspace_id,
    )




@router.get(
    "/{workspace_id}/documents",
    response_model=list[DocumentResponse],
)
def get_workspace_documents(
    workspace_id: int,
    db: Session = Depends(get_db),
):

    return (
        WorkspaceDocumentService
        .get_workspace_documents(
            db,
            workspace_id,
        )
    )





@router.delete("/{workspace_id}")
def delete_workspace(
    workspace_id: int,
    db: Session = Depends(get_db),
):
    success = (
        WorkspaceService.delete_workspace(
            db,
            workspace_id,
        )
    )

    return {
        "success": success
    }




