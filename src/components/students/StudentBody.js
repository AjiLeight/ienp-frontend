import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import AddStudent from "./AddStudent";
import StudnetTable from "./StudentTable";

export default function StudentBody() {
  const user = JSON.parse(localStorage.getItem("login")).username;
  const [department, setDepartment] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [students, setStudents] = useState([]);
  const [addStudent, setAddStudent] = useState(false);
  const yearRef = useRef("1");

  useEffect(() => {
    async function fetchDepartment() {
      await axios.get(`/api/v1/faculty/${user}`).then(async (res) => {
        setDepartment(await res.data.department);
        setIsMounted(true);
      });
    }
    fetchDepartment();
  }, [user]);

  async function yearSearchHandler() {
    const enteredYear = yearRef.current.value;
    await axios
      .get(`/api/v1/student/year/${department}/${enteredYear}`)
      .then(async (res) => {
        setStudents(await res.data);
      });
  }

  function toggleAddStudent() {
    setAddStudent(!addStudent);
  }

  async function deleteHandler() {
    let rollNoList = [];
    students.forEach((student) => rollNoList.push(student.rollNo));
    await axios
      .delete("api/v1/student", { data: rollNoList })
      .then(async (res) => {
        console.log(res.data);
        studentChangeHandler();
      });
  }

  async function increaseHandler() {
    let rollNoList = [];
    students.forEach((student) => rollNoList.push(student.rollNo));
    await axios.put("api/v1/student/increase", rollNoList).then(async (res) => {
      console.log(res.data);
      studentChangeHandler();
    });
  }

  const batchManagementElement = (
    <>
      <div className="d-flex flex-row shadow border border-grey w-50 p-2 mt-3 justify-content-between">
        <button
          className="btn fw-bold text-dark  w-25 ms-5"
          onClick={toggleAddStudent}
        >
          Add Student
        </button>
        {yearRef.current.value === "3" ? (
          <button
            className="btn fw-bold text-danger me-5 w-25"
            onClick={deleteHandler}
          >
            Delete Bacth
          </button>
        ) : (
          <button
            className="btn fw-bold text-danger me-5 w-25"
            onClick={increaseHandler}
          >
            Increase Year
          </button>
        )}
      </div>
    </>
  );

  async function studentChangeHandler() {
    const enteredYear = yearRef.current.value;
    await axios
      .get(`/api/v1/student/year/${department}/${await enteredYear}`)
      .then(async (res) => {
        setStudents(await res.data);
      });
  }

  const addStudentElemet = (
    <>
      <div className="d-flex flex-column shadow border border-grey w-50 p-2 mt-3 ">
        <button
          className="btn text-danger w-25 fw-bold align-self-end"
          onClick={toggleAddStudent}
        >
          close
        </button>
        <AddStudent
          year={yearRef.current.value}
          department={department}
          onSave={studentChangeHandler}
        />
      </div>
    </>
  );

  const tableElement = (
    <>
      <div className="d-flex flex-column shadow border border-grey w-50 p-2 mt-3">
        <StudnetTable students={students} onChange={studentChangeHandler} />
      </div>
    </>
  );

  const bodyElement = (
    <>
      <div className="d-flex flex-column shadow border border-grey w-50 p-2 mt-3">
        <span className="fs-4 fw-bold m-3">Department : {department}</span>
        <div className="d-flex flex-row">
          <span className="fw-bold m-3">Year : </span>
          <select type="text" className="form-control w-25 m-2" ref={yearRef}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <button
            className="btn btn-outline-dark m-2"
            onClick={yearSearchHandler}
          >
            select
          </button>
        </div>
      </div>
      {batchManagementElement}
      {addStudent ? addStudentElemet : <></>}

      {students.length !== 0 ? (
        tableElement
      ) : (
        <>
          <p className="mt-3 fs-5">No student data found</p>
        </>
      )}
    </>
  );

  return <>{isMounted ? bodyElement : "Loading..."}</>;
}
