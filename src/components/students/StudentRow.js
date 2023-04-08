import { useRef, useState } from "react";
import axios from "../api/axios";

export default function StudentRow(props) {
  const [edit, setEdit] = useState();
  const nameRef = useRef();
  function editHandler() {
    setEdit(!edit);
  }

  function deleteHandler() {
    axios.delete(`api/v1/student/${props.rollNo}`).then((res) => {
      console.log(res.data);
      props.onChange();
    });
  }

  async function saveHandler() {
    const enteredName = nameRef.current.value;
    const data = {
      rollNo: props.rollNo,
      name: enteredName,
    };
    await axios.put("/api/v1/student", data).then(async (res) => {
      console.log(await res);
      setEdit(!edit);
      props.onChange();
    });
  }

  const dataElement = (
    <>
      <td className="w-25">
        <span>{props.rollNo}</span>
      </td>
      <td className="w-25">
        <span>{props.name}</span>
      </td>
      <td>
        <button
          className="btn btn-outline-primary w-25 me-2"
          onClick={editHandler}
        >
          Edit
        </button>
        <button
          className="btn btn-outline-danger w-25 ms-2"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </td>
    </>
  );

  const editElement = (
    <>
      <td className="w-25">
      <span>{props.rollNo}</span>
      </td>
      <td className="w-25">
        <input
          type="text"
          className="form-control"
          defaultValue={props.name}
          ref={nameRef}
        />
      </td>
      <td>
        <button
          className="btn btn-outline-primary w-25 me-2"
          onClick={saveHandler}
        >
          SAVE
        </button>
        <button
          className="btn btn-outline-danger w-25 ms-2"
          onClick={editHandler}
        >
          CANCEL
        </button>
      </td>
    </>
  );
  return (
    <tr className="align-items-center">{edit ? editElement : dataElement}</tr>
  );
}
