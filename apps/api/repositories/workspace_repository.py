from sqlalchemy.orm import Session
from apps.api.db.models import Workspace


class WorkspaceRepository:



    @staticmethod
    def delete(
        db: Session,
        workspace: Workspace,
    ):
        db.delete(workspace)
        db.commit()



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
    def create(
        db: Session,
        name: str,
    ) -> Workspace:

        workspace = Workspace(
            name=name
        )

        db.add(workspace)
        db.commit()
        db.refresh(workspace)

        return workspace

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Workspace]:

        return (
            db.query(Workspace)
            .order_by(Workspace.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        workspace_id: int,
    ):

        return (
            db.query(Workspace)
            .filter(
                Workspace.id == workspace_id
            )
            .first()
        )

    @staticmethod
    def delete(
        db: Session,
        workspace: Workspace,
    ):

        db.delete(workspace)
        db.commit()




        



     