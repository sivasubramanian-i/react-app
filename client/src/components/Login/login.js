import { Button, TextField, Link } from '@material-ui/core';
import api from '../../utils/api';
import * as API_ENDPOINTS from '../../utils/url';
import React, { useState } from 'react';
import swal from 'sweetalert';
import bcrypt from 'bcryptjs';

var salt = bcrypt.genSaltSync(10);

const Login = (props) => {
    const [state , setState] = useState({
        username : "",
        password : ""
    })

    const onChange = (e) => {
        const {name , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [name] : value
        }))
    }

    const onSubmit = () => {
        const pwd = bcrypt.hashSync(state.password, salt);
        api({
            method: 'POST',
            url: `${API_ENDPOINTS.LOGIN}`,
            data: {
                username: state.username,
                password: pwd
            }
        }).then((result) => {
            localStorage.setItem('token', result.data.token);
            props.history.push('/dashboard');
        }).catch(async (error) => {
            if (error.response && error.response.data && error.response.data.errorMessage) {
                swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
                });
            }
        });
    }

    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Login</h2>
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
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={state.username === '' && state.password === ''}
            onClick={onSubmit}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/register">
            Register
          </Link>
        </div>
      </div>
    );
}
export default Login;