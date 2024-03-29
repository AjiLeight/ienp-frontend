import axios from "../api/axios";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { DepartmentList } from "../../constants/constants";
import { useState } from "react";

function SignupCard() {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const departmentRef = useRef();
  const [errorCaught, setErrorCaught] = useState(false);
  const [error, setError] = useState("");

  function signupHandler(event) {
    event.preventDefault();

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredName = nameRef.current.value;
    const enteredDepartment = departmentRef.current.value;

    const signupData = {
      username: enteredUsername,
      password: enteredPassword,
      name: enteredName,
      department: enteredDepartment,
    };

    axios
      .post("/api/auth/register", signupData, {
        headers: { Authorization: "" },
      })
      .then((res) => {
        localStorage.setItem(
          "login",
          JSON.stringify({
            login: "true",
            username: res.data.username,
            token: res.data.accessToken,
          })
        );
        console.log(res);
        history.push("/home");
      })
      .catch((err) => {
        setErrorCaught(true);
        setError(err.response.data.accessToken);
      });
  }

  return (
    <>
      <div className="card-body">
        <form>
          <label htmlFor="username" className="mb-2">
            Username
          </label>
          <input
            type="text"
            className="form-control align-self-start mb-2"
            ref={usernameRef}
            id="username"
            required
          ></input>

          <label htmlFor="password" className="mb-2">
            Password
          </label>
          <input
            type="password"
            className="form-control align-self-start mb-2"
            ref={passwordRef}
            id="password"
            required
          ></input>

          <label htmlFor="name" className="mb-2">
            Name
          </label>
          <input
            type="text"
            className="form-control align-self-start mb-2"
            ref={nameRef}
            id="name"
            required
          ></input>

          <label htmlFor="department" className="mb-2">
            Department
          </label>
          <select
            className="form-control align-self-start mb-2"
            ref={departmentRef}
            id="department"
          >
            {DepartmentList.map((department) => (
              <option value={department} key={department}>
                {department}
              </option>
            ))}
          </select>

          <button className="btn btn-outline-dark mt-2" onClick={signupHandler}>
            SignUp
          </button>
        </form>
      </div>
      {errorCaught ? <div className="text-danger p-2">{error}</div> : <></>}
    </>
  );
}

export default SignupCard;
