import { databases, storage } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  image: File | null;
  setImage: (image: File | null) => void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",
  image: null,

  setSearchString: async (searchString: string) => set({ searchString }),

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  setImage: (imageSelected: File | null) => set({ image: imageSelected }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    // Delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    // Delete file in AppWrite storage bucket
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    // Delete document from DB
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));
