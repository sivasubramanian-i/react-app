const Employee = require('../models/employee.model');
// Create and Save a new employee
exports.create = (req, res) => {
    // Create a Employee
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        address: req.body.address,
        mobile: req.body.mobile
    });

    // Save employee in the database
    employee.save()
    .then(data => {
        res.status(200).json({
            status: true,
            title: 'Employee Added successfully.',
            data: data
        });
    }).catch(err => {
        res.status(400).json({
            errorMessage: err,
            status: false
        });
    });
};
// Retrieve and return all employees from the database.
exports.get = (req, res) => {
    try {
        var query = {};
        // query["$and"] = [];
        if (req.query && req.query.search) {
            let orCond = [];
            orCond.push({ name: { $regex: req.query.search } });
            orCond.push({ email: { $regex: req.query.search } });
            orCond.push({ address: { $regex: req.query.search } });
            orCond.push({ age: { $regex: req.query.search } });
            orCond.push({ mobile: { $regex: req.query.search } });
            query["$or"] = orCond;
        }
        if (req.params && req.params.id) {
            query["$and"].push({
              id: req.params.id
            });
        }
        var perPage = 5;
        var page = req.query.page || 1;
        Employee.find(query)
          .skip((perPage * page) - perPage).limit(perPage)
          .then((data) => {
            Employee.countDocuments(query)
              .then((count) => {
                if (data && data.length > 0) {
                  res.status(200).json({
                    status: true,
                    title: 'Employee retrived.',
                    employees: data,
                    current_page: page,
                    total: count,
                    pages: Math.ceil(count / perPage),
                  });
                } else {
                  res.status(400).json({
                    errorMessage: 'There is no employee!',
                    status: false
                  });
                }
    
              });
    
          }).catch(err => {
            res.status(400).json({
              errorMessage: err.message || err,
              status: false
            });
          });
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};
// Update a employee identified by the id in the request
exports.update = (req, res) => {
    Employee.findByIdAndUpdate(req.body.id, req.body, { new: true })
    .then((employee) => {
      if (!employee) {
        res.status(404).json({
          message: "No employee found",
        });
      }
      res.status(200).json({
        status: true,
        title: 'Employee updated.'
      });
    })
    .catch((err) => {
        res.status(400).json({
            errorMessage: err,
            status: false
        });
    });
    
};
// Delete a employee with the specified id in the request
exports.delete = (req, res) => {
    try {
        if (req.params && req.params.id) {
            Employee.findByIdAndRemove(req.params.id, (err, data) => {
            if (data) {
              res.status(200).json({
                status: true,
                title: 'Employee deleted.'
              });
            } else {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: 'Add proper parameter first!',
            status: false
          });
        }
    } catch (e) {
        res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
        });
    }
};
