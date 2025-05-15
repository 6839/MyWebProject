// Require the express web application framework (https://expressjs.com)
const express = require('express')
const session = require('express-session');
// Create a new web application by calling the express function
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'XXXXXXXX',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// unify the handling of message_prompt
app.use((req, res, next) => {
  res.locals.message_prompt = req.session.message_prompt || '';
  req.session.message_prompt = ''; // immediate clear to avoid cross-request impact
  next();
});

// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))
const path = require('path')
const { title } = require('process')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

function generateVerificationCode(code) {
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sit774'
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed: ', err.stack);
    return;
  }
  console.log('Connection successful, ID: ', connection.threadId);
});

function runMysqlQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// visitor get index page
app.get('/', async (req, res, next) => {
  if (typeof req.session.isFirstAccess === 'undefined') {
    req.session.isFirstAccess = true;
  }

  if (req.session.isFirstAccess) {
    req.session.allimgSrc = await runMysqlQuery('select imgSrc from butterfly');
    req.session.allButterflySrc = req.session.allimgSrc.map(row => row.imgSrc);
    req.session.role = 0;
    req.session.isFirstAccess = false;
  }

  if (req.session.role == 0) {
    req.session.visit_verificationCode = '';
    req.session.visit_verificationCode = generateVerificationCode(req.session.visit_verificationCode);
    const total_butterfly = await runMysqlQuery('select * from butterfly');
    res.render('index', {
      title: 'dKin BC Survey',
      butterflyList: total_butterfly,
      verificationCode: req.session.visit_verificationCode,
      message_prompt: res.locals.message_prompt,
      allButterflySrc: req.session.allButterflySrc,
      displayNote: true,
      role: req.session.role
    });
  } else {
    req.session.message_prompt = 'wrong_access';
    res.redirect('/surveyRecords');
  }
});

// visitor user submit a survey
app.post('/surveySubmit', async (req, res, next) => {
  // get data from user's input
  let inputFirstname = req.body.firstname;
  let inputLastname = req.body.lastname;
  let inputEmail = req.body.email;
  let inputFavouriteButterfly = [];
  let inputComments = req.body.comments;
  let inputValidationCode = req.body.validationCode;

  for (const key in req.body) {
    if (req.body[key] == 'on') {
      inputFavouriteButterfly.push(key);
    }
  }

  // if the validation failed then render the invalid page
  if (inputValidationCode != req.session.visit_verificationCode) {
    req.session.message_prompt = 'invalid';
    res.redirect('/');
    // if the validation succeed then render the other page
  } else {
    let myDate = new Date();
    let hours = String(myDate.getHours()).padStart(2, '0');
    let minutes = String(myDate.getMinutes()).padStart(2, '0');
    let seconds = String(myDate.getSeconds()).padStart(2, '0');

    // call insert function to store data to database
    await runMysqlQuery('insert into survey (firstname, lastname, Email, favouritebutterflylist, comment, committime) VALUES (?,?,?,?,?,?)', [
      inputFirstname,
      inputLastname,
      inputEmail,
      inputFavouriteButterfly.toString(),
      inputComments,
      myDate
    ]);

    for (let i = 0; i < inputFavouriteButterfly.length; i++) {
      await runMysqlQuery('update butterfly set sumLike = sumLike + 1 where id = ?', [inputFavouriteButterfly[i]]);
    }

    // query user total numbers of survey from database
    user_butterfly = await runMysqlQuery('select * from butterfly where id in (?)', [inputFavouriteButterfly]);

    // render result by using data above
    res.render('visitor_results', {
      title: 'dKin BC Survey Result',
      Result_Completed_Time: `${myDate.toDateString()} ${hours}:${minutes}:${seconds} GMT+1000 (Australian Eastern Standard Time)`,
      Result_Firstname: inputFirstname,
      Result_Lastname: inputLastname,
      Result_Email: inputEmail,
      butterflyList: user_butterfly,
      Result_Comments: inputComments,
      allButterflySrc: req.session.allButterflySrc,
      message_prompt: res.locals.message_prompt,
      displayNote: false,
      role: req.session.role
    })
  }
});

// member login page
app.get('/memberLogin', async (req, res, next) => {
  if (req.session.role == 0) {
    res.render('member_login', {
      title: 'dKin BC Survey',
      verificationCode: '',
      message_prompt: res.locals.message_prompt,
      allButterflySrc: req.session.allButterflySrc,
      displayNote: false,
      role: req.session.role
    });
  } else {
    req.session.message_prompt = 'already_login_to_login';
    res.redirect('/surveyRecords');
  }

});

// member login handler
app.post('/memberLoginSubmit', async (req, res, next) => {
  let inputUsername = req.body.username;
  let inputPassword = btoa(req.body.password);

  member_check = await runMysqlQuery('select * from member where username = ?', [inputUsername]);
  if (member_check.length == 0) {
    req.session.message_prompt = 'member_not_exist';
    res.redirect('/memberLogin');
  } else {
    if (member_check[0].password != inputPassword) {
      req.session.message_prompt = 'login_wrong_password';
      res.redirect('/memberLogin');
    } else {
      req.session.role = 1;
      res.redirect('/surveyRecords')
    }
  }
});

// member register page
app.get('/memberRegister', async (req, res, next) => {
  if (req.session.role == 0) {
    res.render('member_register', {
      title: 'dKin BC Survey',
      verificationCode: '',
      message_prompt: res.locals.message_prompt,
      allButterflySrc: req.session.allButterflySrc,
      displayNote: false,
      role: req.session.role
    });
  } else {
    req.session.message_prompt = 'already_login_to_register';
    res.redirect('/surveyRecords');
  }
});

// member register handler
app.post('/memberRegisterSubmit', async (req, res, next) => {
  let inputUsername = req.body.username;
  let inputPassword = btoa(req.body.password);
  let inputEmail = req.body.email;
  let inputGrantCode = parseInt(req.body.grantcode);
  let GrantCodeList = require('./GrantCode.json')

  if (GrantCodeList.Codelist.includes(inputGrantCode)) {
    member_check = await runMysqlQuery('select * from member where username = ?', [inputUsername]);
    if (member_check.length != 0) {
      req.session.message_prompt = 'register_existed';
      res.redirect('/memberRegister');
    } else {
      await runMysqlQuery('insert into member (username, password, email, grandCode, registertime) VALUES (?,?,?,?,?)', [
        inputUsername,
        inputPassword,
        inputEmail,
        inputGrantCode,
        new Date()
      ]);
      req.session.message_prompt = 'register_finish'
      res.redirect('/memberRegister');
    }
  } else {
    req.session.message_prompt = 'wrong_grantcode';
    res.redirect('/memberRegister');
  }
});

app.get('/surveyRecords', async (req, res, next) => {
  if (req.session.role == 1) {
    req.session.survey_records = await runMysqlQuery('select * from survey');
    req.session.favourite_butterflyList = await runMysqlQuery('select * from butterfly order by sumlike desc limit 3;');
    res.render('member_surveyRecords', {
      title: 'dKin BC Survey',
      survey_records: req.session.survey_records,
      favourite_butterflyList: req.session.favourite_butterflyList,
      allButterflySrc: req.session.allButterflySrc,
      message_prompt: res.locals.message_prompt,
      displayNote: true,
      role: req.session.role
    });
  } else {
    req.session.message_prompt = 'visitor_fail_access_member_content';
    res.redirect('/');
  }
});

app.get('/butterflyLibrary', async (req, res, next) => {
  if (req.session.role == 1) {
    req.session.page = parseInt(req.query.page) || 1; // get current page number, default 1
    req.session.pageSize = 10; // each page shows 10 rows
    req.session.offset = (req.session.page - 1) * req.session.pageSize; 
  
    // query total rows
    req.session.totalCountRes = await runMysqlQuery('select count(*) as total from butterfly');
    req.session.totalCount = req.session.totalCountRes[0].total;
    req.session.totalPages = Math.ceil(req.session.totalCount / req.session.pageSize); // calculate total page number
  
    // query current page data
    req.session.butterflyList = await runMysqlQuery(`select * from butterfly limit ${req.session.offset}, ${req.session.pageSize}`);
  
    res.render('member_allButterflyList', {
      title: 'dKin BC Survey',
      allButterflySrc: req.session.allButterflySrc,
      message_prompt: res.locals.message_prompt,
      role: req.session.role,
      currentPage: req.session.page,
      totalPages: req.session.totalPages,
      displayNote: false,
      butterflyList: req.session.butterflyList
    });
  } else {
    req.session.message_prompt = 'visitor_fail_access_member_content';
    res.redirect('/');
  }
});

app.get('/exit', async (req, res, next) => {
  if (req.session.role == 1) {
    req.session.role = 0;
    res.redirect('/')
  } else {
    req.session.message_prompt = 'visitor_fail_access_member_content';
    res.redirect('/');
  }
});

// REST endpoint for getting all user data JSON response
app.get('/membersapi', async (req, res, next) => {
  // Retrieve data from table User on the server 
  // and return it in a JSON response
  req.session.members_rows = await runMysqlQuery('select * from member');
  res.json(req.session.members_rows)
});

// Tell our application to listen to requests at port 3000 on the localhost
app.listen(port, () => {
  // When the application starts, print to the console that our app is
  // running at http://localhost:3000. Print another message indicating
  // how to shut the server down.
  console.log(`Web server running at: http://localhost:${port}`)
  console.log(`Type Ctrl+C to shut down the web server`)
})
