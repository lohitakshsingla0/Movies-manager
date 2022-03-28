const client = require("./database/index");
const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
var cookieParser = require('cookie-parser')

const app = express();
var forms = multer();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", __dirname);
client.connect();

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});

app.get("/users", (req, res) => {
  client.query(`Select * from user_list`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});



app.get("/suggestions", (req, res) => {
  client.query(`Select * from get_suggestions('${req.cookies['username']}')`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

app.get("/", async function (req, res) {
  res.sendFile("Userloginpage.html", { root: __dirname + "/ui" });
});

app.get("/dashboard.html", async function (req, res) {
  res.sendFile("/dashboard.html", { root: __dirname + "/ui" });
});

app.get("/addmovies.html", async function (req, res) {
  res.sendFile("/addmovies.html", { root: __dirname + "/ui" });
});
app.get("/ratings.html", async function (req, res) {
  res.sendFile("/ratings.html", { root: __dirname + "/ui" });
});

app.get("/managemovies.html", async function (req, res) {
  res.sendFile("/managemovies.html", { root: __dirname + "/ui" });
});

app.get("/managepeople.html", async function (req, res) {
  res.sendFile("/managepeople.html", { root: __dirname + "/ui" });
});

app.get("/AllMovies.html", async function (req, res) {
  res.sendFile("/AllMovies.html", { root: __dirname + "/ui" });
});

app.get("/manageusers.html", async function (req, res) {
  res.sendFile("/manageusers.html", { root: __dirname + "/ui" });
});

app.get("/movies", (req, res) => {
  client.query(`Select * from movie_list`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});


app.get("/movie_by_genre/:genre", (req, res) => {

  let genre =req.params.genre;
  let fetchQuery = `select * from movie_list where genre1 ='${genre}' or genre2 = '${genre}' or genre3='${genre}' order by mean_rating`
  client.query(fetchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send(err.message);
    }
  });
  client.end;
});

app.post("/person", (req, res) => {
  const movie = req.body;
  console.log(movie)
  if(movie.date == '')
    movie.date = null;

  let addQuery = `insert into movie_related_person (person_name, dob, sex) VALUES ('${movie.person}', ${movie.date}, '${movie.gender}') `
  console.log(addQuery)
  client.query(addQuery, (err, result) => {
    if (!err) {
      res.send("Successfully inserted person");
    } else {
      res.send(err.message);
    }
  });
  client.end;
});

app.post("/users", (req, res) => {
  const movie = req.body;

  let updateQuery = `update user_list set forename =  '${movie.forename}', surename = '${movie.surname}', dob = '${movie.dob}' where user_name = '${movie.name}'`
  console.log(updateQuery)
  client.query(updateQuery, (err, result) => {
    if (!err) {
res.redirect(303,'/manageusers.html')    
} else {
      console.log(err.message);
    }
  });
  client.end;
});

app.get("/users-info/:user", (req, res) => {
  const movie = req.body;

  let updateQuery = `select forename, surename, dob from user_list where user_name ='${req.params.user}';`
  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});


app.post("/person-delete", (req, res) => {
  const movie = req.body;
  console.log(movie)
  let deleteQuery = `delete from movie_related_person where person_name ='${movie.person_name}'`
  console.log(deleteQuery)
  client.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send("Successfully deleted the person");
    } else {
      res.send(err.message);
    }
  });
  client.end;
});



app.post("/movies-delete", (req, res) => {
  const movie = req.body;
  console.log(movie)
 
    movie.movie_list =  movie.movie_list.replaceAll('(','(\'');
    movie.movie_list =  movie.movie_list.replaceAll(',','\',');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('\'\'','\'');
    movie.movie_list =  'Row'+movie.movie_list;
  

  let deleteQuery = `delete from movie_list where movie_and_year =${movie.movie_list}::unique_movies`

  console.log(deleteQuery)
  client.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send("Successfully deleted the movie");
    } else {
      res.send(err.message);
    }
  });
  client.end;
});


app.post("/rate-movie", (req, res) => {
  const movie = req.body;
  console.log(movie)
 
    movie.movie_list =  movie.movie_list.replaceAll('(','(\'');
    movie.movie_list =  movie.movie_list.replaceAll(',','\',');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('\'\'','\'');
    movie.movie_list =  'Row'+movie.movie_list;
  

  let insert = `insert into movies_watched (user_name, rating, movie) VALUES ('${req.cookies['username']}', ${movie.rate}, ${movie.movie_list})`
  
  console.log(insert)
  client.query(insert, (err, result) => {
    if (!err) {
      res.redirect(303,"/dashboard.html");
    } else {
      res.send(err.message);
    }
  });
  client.end;
});


app.get("/userrated", (req, res) => {

  let fetchQuery = `select * from movies_watched where user_name = '${req.cookies['username']}'`

  client.query(fetchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});



app.get("/userrated/:movie", (req, res) => {


  console.log(req.params.movie)
  let movie =req.params.movie;
  movie =  movie.replaceAll('(','(\'');
  movie =  movie.replaceAll(',','\',');
  movie =  movie.replaceAll('"','\'');
  movie =  movie.replaceAll('"','\'');
  movie =  movie.replaceAll('\'\'','\'');
  movie = 'Row'+movie;
  
  let fetchQuery = `select rating from movies_watched where user_name = '${req.cookies['username']}' and movie = ${movie}::unique_movies`
  client.query(fetchQuery, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
    }
  });
  client.end;
});


app.post("/movies", (req, res) => {
  const movie = req.body;
  console.log(movie);

  if (movie.genre2 == null) {
     console.log("genere is null");
  }

  if(movie.seq ==''){
    movie.seq = null;
  }

  if(movie.movie_poster_link ==''){
    movie.movie_poster_link = null;
  }

  if(movie.seq !=null){
    movie.seq =  movie.seq.replaceAll('(','(\'');
    movie.seq =  movie.seq.replaceAll(',','\',');
    movie.seq =  movie.seq.replaceAll('"','\'');
    movie.seq =  movie.seq.replaceAll('"','\'');
    movie.seq =  movie.seq.replaceAll('\'\'','\'');
    movie.seq = 'Row'+movie.seq;
  }

  movie.year = movie.year.replaceAll('\'','');

  console.log(movie);

  let insertQuery = `INSERT INTO movie_list (movie_and_year, leading_actor, directed_by, sub_ordinated_to, written_by, genre1, genre2, genre3, movie_poster_link) 
   VALUES(
     Row('${movie.movie_name}','${movie.year}'), 
      '${movie.actor}', 
      '${movie.direc}',  
       ${movie.seq}, 
     '${movie.script_writer}', 
      '${movie.genre_movie1}', 
    '${movie.genre_movie2}', 
     '${movie.genre_movie3}',
      ${movie.movie_poster_link})`;

   client.query(insertQuery, (err, result) => {
     if (!err) {
       res.send("Insertion was successful");
     } else {
       res.send(err.message);
     }
   });

   client.end;
});


app.post("/movies-update", (req, res) => {
  const movie = req.body;
  console.log(movie);

  if (movie.genre2 == null) {
     console.log("genere is null");
  }

  if(movie.seq =='' || movie.seq =='null'){
    movie.seq = null;
  }

  if(movie.movie_poster_link ==''){
    movie.movie_poster_link = null;
  }

  if(movie.seq !=null){
    movie.seq =  movie.seq.replaceAll('(','(\'');
    movie.seq =  movie.seq.replaceAll(',','\',');
    movie.seq =  movie.seq.replaceAll('"','\'');
    movie.seq =  movie.seq.replaceAll('"','\'');
    movie.seq =  movie.seq.replaceAll('\'\'','\'');
    movie.seq = 'Row'+movie.seq;
  }

  if(movie.movie_list !=null){
    movie.movie_list =  movie.movie_list.replaceAll('(','(\'');
    movie.movie_list =  movie.movie_list.replaceAll(',','\',');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('"','\'');
    movie.movie_list =  movie.movie_list.replaceAll('\'\'','\'');
    movie.movie_list =  'Row'+movie.movie_list;
  }

if(movie.genre_movie2 =='')
    movie.genre_movie2 =null;

  if(movie.genre_movie3 =='')
    movie.genre_movie3 =null;



  console.log(movie);
  let updateQuery
  if(movie.seq !=null)
      updateQuery = `UPDATE movie_list set leading_actor = '${movie.actor}',directed_by = '${movie.direc}',written_by = '${movie.script_writer}',sub_ordinated_to = ${movie.seq},  genre1='${movie.genre_movie1}' ,genre2='${movie.genre_movie2}',genre3='${movie.genre_movie3}' where movie_and_year =${movie.movie_list}::unique_movies `
  else
      updateQuery = `UPDATE movie_list set leading_actor = '${movie.actor}',directed_by = '${movie.direc}',written_by = '${movie.script_writer}',  genre1='${movie.genre_movie1}' ,genre2='${movie.genre_movie2}',genre3='${movie.genre_movie3}' where movie_and_year =${movie.movie_list}::unique_movies `

  console.log(updateQuery);
  client.query(updateQuery, (err, result) => {
     if (!err) {
       res.send("Insertion was successful");
     } else {
       res.send(err.message);
     }
   });

   client.end;
});

app.get("/movies-related-person", (req, res) => {
  client.query(`Select * from movie_related_person`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send(err.message);
    }
  });
  client.end;
});

app.get("/genres", (req, res) => {
  client.query(`Select * from genres`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send(err.message);
    }
  });
  client.end;
});


app.get("/movies/:movieName", (req, res) => {
  client.query(`Select * from movie_list where movie_and_year = ${req.params.movieName}::unique_movies`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send(err.message);
    }
  });
  client.end;
});

app.post("/users", (req, res) => {
  const user = req.body;
  console.log(user);
  let insertQuery = `insert into movie_related_person(person_name, dob , sex) 
                        values('${user.person_name}', '${user.dob}', '${user.sex}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      res.send(err.message);
    }
  });

  client.end;
});

app.post("/rate/:user/:movie/:rate", (req, res) => {
  const user = req.body;
  console.log(user);
  let insertQuery = `insert into movie_related_person(person_name, dob , sex) 
                          values('${user.person_name}', '${user.dob}', '${user.sex}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      res.send(err.message);
    }
  });

  client.end;
});
