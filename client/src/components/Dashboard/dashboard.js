import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import api from '../../utils/api';
import * as API_ENDPOINTS from '../../utils/url';
import swal from 'sweetalert';

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            openModal: false,
            openEditModal: false,
            openViewModal: false,
            loading: false,
            id: '',
            page: 1,
            search: '',
            employees: [],
            pages: 0,
            name: '',
            email: '',
            age: '',
            address: '',
            mobile: ''
        };
    }

    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (token === 'null') {
            this.props.history.push('/');
        } else {
            this.setState({ token: token }, () => {
                this.getEmployee();
            });
        }
    }

    getEmployee = () => {
        this.setState({ loading: true });
        let data = '?';
        data = `${data}page=${this.state.page}`;
        if (this.state.search) {
            data = `${data}&search=${this.state.search}`;
        }
        api({
            method: 'GET',
            url: `${API_ENDPOINTS.READ}${data}`,
        }).then((result) => {
            this.setState({ loading: false, employees: result.data.employees, pages: result.data.pages });
        }).catch(async (error) => {
            swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.setState({ loading: false, employees: [], pages: 0 },()=>{});
        });
    }

    deleteEmployee = (id) => {
        api({
            method: 'DELETE',
            url: `${API_ENDPOINTS.DELETE}/${id}`,
        }).then((result) => {
            swal({
                text: result.data.title,
                icon: "success",
                type: "success"
            });
            this.setState({ page: 1 }, () => {
                this.pageChange(null, 1);
            });
        }).catch(async (error) => {
            swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
        });
    }

    pageChange = (e, page) => {
        this.setState({ page: page }, () => {
            this.getEmployee();
        });
    }

    logOut = () => {
        localStorage.setItem('token', null);
        this.props.history.push('/');
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => { });
        if (e.target.name === 'search') {
        this.setState({ page: 1 }, () => {
            this.getEmployee();
        });
        }
    };

    create = () => {
        api({
            method: 'POST',
            url: `${API_ENDPOINTS.CREATE}`,
            data: {
                name: this.state.name,
                email: this.state.email,
                age: this.state.age,
                address: this.state.address,
                mobile: this.state.mobile
            }
        }).then((result) => {
            swal({
                text: result.data.title,
                icon: "success",
                type: "success"
            });
        
            this.handleClose();
            this.setState({ name: '', email: '', age: '', address: '', mobile: '', page: 1 }, () => {
                this.getEmployee();
            });
        }).catch(async (error) => {
            swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleClose();
        });
    }

    update = () => {
        api({
            method: 'PUT',
            url: `${API_ENDPOINTS.UPDATE}`,
            data: {
                id: this.state.id,
                name: this.state.name,
                email: this.state.email,
                age: this.state.age,
                address: this.state.address,
                mobile: this.state.mobile
            }
        }).then((result) => {
            swal({
                text: result.data.title,
                icon: "success",
                type: "success"
            });
        
            this.handleEditClose();
            this.setState({ name: '', email: '', age: '', address: '', mobile: ''}, () => {
                this.getEmployee();
            });
        }).catch(async (error) => {
            swal({
                text: error.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleEditClose();
        });
    }

    handleOpen = () => {
        this.setState({
            openModal: true,
            id: '',
            name: '',
            email: '',
            age: '',
            address: '',
            mobile: ''
        });
    };

    handleClose = () => {
        this.setState({ openModal: false });
    };

    handleEditOpen = (type, data) => {
        this.setState({
            openEditModal: type === 'edit' ? true : false,
            openViewModal: type === 'view' ? true : false,
            id: data._id,
            name: data.name,
            email: data.email,
            age: data.age,
            address: data.address,
            mobile: data.mobile,
        });
    };

    handleEditClose = () => {
        if(this.state.openEditModal)
            this.setState({ openEditModal: false });
        else
            this.setState({ openViewModal: false });
    };

    render() {
        return (
        <div>
            {this.state.loading && <LinearProgress size={40} />}
            <div>
            <h2>Dashboard</h2>
            <Button
                className="button_style"
                variant="contained"
                color="primary"
                size="small"
                onClick={this.handleOpen}
            >
                Add Employee
            </Button>
            <Button
                className="button_style"
                variant="contained"
                size="small"
                onClick={this.logOut}
            >
                Log Out
            </Button>
            </div>

            {/* Edit Employee */}
            <Dialog
                open={this.state.openEditModal ? this.state.openEditModal : this.state.openViewModal}
                onClose={this.handleEditClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{this.state.openEditModal ? 'Edit Employee' : 'View Employee' }</DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-basic"
                        type="text"
                        autoComplete="off"
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                        placeholder="Employee Name"
                        disabled={this.state.openViewModal ? true : false}
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="email"
                        autoComplete="off"
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        placeholder="Email"
                        disabled={this.state.openViewModal ? true : false}
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="number"
                        autoComplete="off"
                        name="age"
                        value={this.state.age}
                        onChange={this.onChange}
                        placeholder="Age"
                        disabled={this.state.openViewModal ? true : false}
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="text"
                        autoComplete="off"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        placeholder="Address"
                        disabled={this.state.openViewModal ? true : false}
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="number"
                        autoComplete="off"
                        name="mobile"
                        value={this.state.mobile}
                        onChange={this.onChange}
                        placeholder="Mobile"
                        disabled={this.state.openViewModal ? true : false}
                        required
                    /><br /><br />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleEditClose} color="primary">
                        Cancel
                    </Button>
                    { this.state.openEditModal ? (
                        <Button
                            disabled={this.state.name === '' || this.state.email === '' || this.state.age === '' || this.state.address === '' || this.state.mobile === ''}
                            onClick={(e) => this.update()} color="primary" autoFocus>
                            Save
                        </Button>
                        ) : ""
                    }
                </DialogActions>
            </Dialog>

            {/* Add Employee */}
            <Dialog
            open={this.state.openModal}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">Add Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-basic"
                        type="text"
                        autoComplete="off"
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                        placeholder="Employee Name"
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="email"
                        autoComplete="off"
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        placeholder="Email"
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="number"
                        autoComplete="off"
                        name="age"
                        value={this.state.age}
                        onChange={this.onChange}
                        placeholder="Age"
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="text"
                        autoComplete="off"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        placeholder="Address"
                        required
                    /><br />
                    <TextField
                        id="standard-basic"
                        type="number"
                        autoComplete="off"
                        name="mobile"
                        value={this.state.mobile}
                        onChange={this.onChange}
                        placeholder="Mobile"
                        required
                    /><br /><br />
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                    disabled={this.state.name === '' || this.state.email === '' || this.state.age === '' || this.state.address === '' || this.state.mobile === ''}
                    onClick={(e) => this.create()} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <br />

            <TableContainer>
                <TextField
                    id="standard-basic"
                    type="search"
                    autoComplete="off"
                    name="search"
                    value={this.state.search}
                    onChange={this.onChange}
                    placeholder="Search"
                    required
                />
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Email ID</TableCell>
                        <TableCell align="center">Age</TableCell>
                        <TableCell align="center">Address</TableCell>
                        <TableCell align="center">Mobile</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.employees?.map((row) => (
                        <TableRow key={row.name}>
                        <TableCell align="center" component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.age}</TableCell>
                        <TableCell align="center">{row.address}</TableCell>
                        <TableCell align="center">{row.mobile}</TableCell>
                        <TableCell align="center">
                            <Button
                                className="button_style"
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={(e) => this.handleEditOpen('view', row)}
                            >
                                View
                            </Button>
                            <Button
                                className="button_style"
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={(e) => this.handleEditOpen('edit', row)}
                            >
                                Edit
                            </Button>
                            <Button
                                className="button_style"
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={(e) => this.deleteEmployee(row._id)}
                            >
                                Delete
                        </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <br />
            <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
            </TableContainer>
        </div>
        );
    }
}