from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from uuid import UUID
from sqlmodel import SQLModel

ModelType = TypeVar("ModelType", bound=SQLModel)

class AbstractRepository(ABC, Generic[ModelType]):
    @abstractmethod
    def get_by_id(self, id: UUID) -> Optional[ModelType]: ...
    
    @abstractmethod
    def get_all(self) -> List[ModelType]: ...
    
    @abstractmethod
    def create(self, instance: ModelType) -> ModelType: ...
    
    @abstractmethod
    def update(self, instance: ModelType) -> ModelType: ...
    
    @abstractmethod
    def delete(self, instance: ModelType) -> ModelType: ...