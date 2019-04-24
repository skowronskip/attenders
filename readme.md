# Description
Attenders Application. Team Project IFE Technical University of Lodz.

Application used for checking attendance during academic classes.
User with lecturer priviliges has following functionalities:
- Adding her/his subjects, setting department, course and subject name
- Adding lectures assigned to particular subject, set time of start, duration, topic
- During lecture (respecting the set start time and duration) checking attendance by showing 6-digits pin, changing every 10sec for 1 minute
- Showing statistics for particular lecture cointaining such information: Amount of students, amount of students from particular course, amount of rates, avarega rate of lecturer

User with student priviliges has following functionalitties:
- With first logging in, setting student's department, course and semester
- Marking attendance by entering 6-digits pin, given by lecturer
- Rating lecture after marking attendance from 1 to 5 stars

# Deployment
How to set up application locally.
1. You must have Node.js and MongoDB installed at your computer
2. You must run MongoDB service
3. Pull repository to your local directory
4. Run commands in terminal: 'npm install; bower install'. If the 'bower install' is not workinkg type 'npm install -g bower' first.
5. Run your local server: 'node app.js' But for developing approach use 'nodemon'.
6. Open 'http://localhost:3000' in your web browser.

# Technologies
Used technologies
- Node.js
- AngularJS
- MongoDB

# Demo
Live demo: http://attenders.pskowron.ski

# Comments
This app is using very, very simplified logging system without authentication.
