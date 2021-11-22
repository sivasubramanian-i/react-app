import React, { useState } from 'react';
import api from '../../utils/api';
import * as API_ENDPOINTS from '../../utils/url';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';

const Register = (props) => {
    const [state , setState] = useState({
        username : "",
        password : "",
        confirm_password: ""
    })

    const onChange = (e) => {
        const {name , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [name] : value
        }))
    }

    const onSubmit = () => {
        api({
            method: 'POST',
            url: `${API_ENDPOINTS.REGISTER}`,
            data: {
                username: state.username,
                password: state.password
            }
        }).then((result) => {
            swal({
                text: result.data.title,
                icon: "success",
                type: "success"
            });
            props.history.push('/');
        }).catch(async (error) => {
            swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
        });
    }

    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={state.username}
            onChange={onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={state.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={state.confirm_password}
            onChange={onChange}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={state.username === '' && state.password === ''}
            onClick={onSubmit}
          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/">
            Login
          </Link>
        </div>
      </div>
    );
}
export default Register;