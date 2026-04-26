import { useNavigate } from "react-router-dom";

function Addcard() {
  const navigate = useNavigate();

  // function addPost() {
  //   if (!userId)
  //     return navigate("/signin", {
  //       state: { signin: true },
  //     });

  //   setEdit(true);
  // }

  return (
    <div className="flex flex-col gap-2 shadow-lg w-full h-35 py-5 px-10 bg-white ">
      <input
        className="create-post-input"
        placeholder="Write a new post"
        onClick={() => {
          navigate("/add-post");
        }}
      />
    </div>
  );
}

export default Addcard;
