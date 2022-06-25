updated last version

# Welcome to Collage Department system repository!

Hi! this project is communication between department and students for their final project,
lecturers submite their projects and students login to the system then choose their team after all sort
their project.

## Alert

- I haven't paid any attention to system design.
- I only cared about the algorithm of a system.
- The security of this system is weak and I will improve the security of the system in future versions

## Roles

we have 5 roles in this system :

- Top-Admin
- Admin
- Scientific-Committee
- Lecturer
- Student

## Description

This system is the relationship between the department and the fourth grade students,
Now (Top Admin or Admin) can create accounts for ( admins, students and Lecturer), and can add a scientific committee that must be one of the Lecturer.
Here each lecturer can submit his project and the project is reviewed by the scientific committee and then accepted or rejected.

When the lecturer submits his project, he is told whether it is accepted or rejected or in progress.
then student logging in, the student first determines his team members, then lists the projects and submits them.
After all the students had teams and listed their projects.!
The system automatically divides the project into teams according to their team grades.

# Requirement

- # you must installed mongodb before, if you dont [**_click here_**](https://youtu.be/RWXfX9DsLfY)

# installation

- `npm i` ( <= this is for installing all dependence(package) of our project.
- `npm i -g nodemon` (<= this is for restarting our server every time when we make change)
- run `nodemon`
- go to browser and type localhost:5000/admin

## add new Top-Admin manually

please make sure to create **_top admin_** manually, because if you don't do that you cant do anything with this project ..

-**add new Top admin**

- Download [**_postman_**](https://www.postman.com/downloads/) to make request .
- make POST request for this route: `/admin/top-admin/add-top-admin`
- insert the following data in the body:
  {
  `"fullName" : "example", "email": "example@example.com", "password": "...",`
  }

### make sure to use [**_mongodb compass_**](https://www.mongodb.com/try/download/compass) to view your data
