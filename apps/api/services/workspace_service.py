from sqlalchemy.orm import Session

from apps.api.repositories.workspace_repository import (
    WorkspaceRepository,
)


class WorkspaceService:

    @staticmethod
    def create_workspace(
        db: Session,
        name: str,
    ):

        return WorkspaceRepository.create(
            db=db,
            name=name,
        )

    @staticmethod
    def get_workspaces(
        db: Session,
    ):

        return WorkspaceRepository.get_all(
            db
        )
    


    @staticmethod
    def get_workspace(
        db: Session,
        workspace_id: int,
    ):

        return WorkspaceRepository.get_by_id(
            db,
            workspace_id,
        )
    




    @staticmethod
    def delete_workspace(
        db: Session,
        workspace_id: int,
    ):
        workspace = (
            WorkspaceRepository.get_by_id(
                db,
                workspace_id,
            )
        )

        if not workspace:
            return False

        WorkspaceRepository.delete(
            db,
            workspace,
        )

        return True