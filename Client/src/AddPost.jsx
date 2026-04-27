import Editor from "./Editor";
import { useEffect } from "react";
import { api } from "./axios";
import { useEdit } from "./editZustand";
import toast from "react-hot-toast";

export default function AddPost() {
  const setEdit = useEdit((state) => state.setEdit);

  useEffect(() => setEdit(true), []);

  async function getText(text) {

    try {
       await toast.promise(
        api
          .post("/posts/add", {
            content: text,
          }),
        {
          loading: 'Saving...',
          success: <b className="text-green-500">Post added successfully!</b>,
          error: (err) => <b className="text-red-500">Failed to add post{err.message}</b>,
        }, {
          className:"mt-10",
        }
      );
    }
    
     
    catch (err) {
      console.error("Failed to add post", err);
      }
  }

  return <Editor sendText={getText} />;
}
