import Editor from "./Editor";
import { useEffect } from "react";
import { api } from "./axios";
import { useEdit } from "./editZustand";

export default function AddPost() {
  const setEdit = useEdit((state) => state.setEdit);

  useEffect(() => setEdit(true), []);

  function getText(text) {
    api
      .post("/posts/add", {
        content: text,
      })
      .then((res) => alert(res))
      .catch((err) => alert(err));
  }

  return <Editor sendText={getText} />;
}
