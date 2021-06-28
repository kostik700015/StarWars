const peopleUrl = 'https://swapi.dev/api/people'
const filmsUrl = 'https://swapi.dev/api/films'
const buttonPeople = document.getElementById('peopleBtn');
const buttonFilms = document.getElementById('filmsBtn');
const list = document.getElementById('list');
var allPeople = ''; 

// display list of people
buttonPeople.addEventListener('click', async () => {
  const people = await getPeople(peopleUrl);
  createPeopleList(people);
  allPeople = people; 
  console.log(people);
});

// display list of films
buttonFilms.addEventListener('click', async () => {
  const films = await getFilms(filmsUrl);
  createFilmsList(films);
  console.log(films);
});

// get people data
async function getPeople(url) {
  try {
    const people = await fetch(url);
    const peopleJSON = await people.json();
    return Promise.all(peopleJSON.results);
  } catch (error) {
    alert('Characters are not found.');
    throw error;
  }
}

// people list
function createPeopleList(people) {
  // first need clear the list
  list.innerHTML = '';
  // create name
  createName('All Characters');
  //create list of people
  var ul = document.createElement('ul');
  ul.id = 'people';
  people.map( (person) => {
    var li = document.createElement('li');
    li.innerHTML = person.name;
    li.id = person.url;
    ul.appendChild(li);
  })
  list.appendChild(ul);
}

// get films data
async function getFilms(url) {
try {
    const films = await fetch(url);
    const filmsJSON = await films.json();
    console.log(filmsJSON.results);
    return Promise.all(filmsJSON.results);
  } catch (error) {
    alert('Films are not found.');
    throw error;
  }
}

// films list
function createFilmsList(films) {
  // first need clear the list
  list.innerHTML = '';
  // create name of films
  createName('All Films');
  //create list of films
  var ul = document.createElement('ul');
  ul.id = 'films';
  films.map( (film) => {
    var li = document.createElement('li');
    li.innerHTML = 'Episode ' + film.episode_id + ': ' + film.title;
    li.id = film.url;
    ul.appendChild(li);
  })
  list.appendChild(ul);
}

// person or film cklick
document.body.addEventListener( 'click', async (event) => {
  var ul = document.querySelector('ul');
  if (ul){
    // id of the cklicked <li> equal url of person or film
    url = event.target.id;
    console.log(url);
    const item = await getItemData(url);
    if(item.name) {
      displayPerson(item);
    } else {
      displayFilm(item);
    }
  } else {
    console.log('no results');
  }
});

// get person or film data
async function getItemData(url) {
  if (url) {
    try {
      const item = await fetch(url);
      const itemJSON = await item.json();
      console.log(itemJSON);
      return itemJSON;
    } catch (error) {
      throw error;
    }
  } else {
    console.log('Results are not found.');
  }
}

async function displayPerson(person) {
  // first need clear the list
  list.innerHTML = '';
  // create name
  createName('Character');
  //create list of people
  var table = document.createElement('table');
  table.class = 'person-data';
  list.appendChild(table);

  var films = ''
  for (let i=0; i<person.films.length; i++){
    var film = await getItemData(person.films[i]);
    console.log(film.title);
    films +=`
      <li id="${person.films[i]}">${film.title}</li>
    `;
  }

  var content = '';
  content +=` 
    <tr>      
      <td><strong>Name: </strong></td>
      <td>${person.name}</td> 
    </tr>
    <tr>      
      <td><strong>Birth year: </strong></td>
      <td>${person.birth_year}</td> 
    </tr> 
    <tr>      
      <td><strong>Films: </strong></td>
      <td>
        <ul class="films-list">
  `;
  content += films;
  content +=`
        </ul>
      </td> 
    </tr> 
    `;
  table.innerHTML = content;
}

async function displayFilm(film) {
  // first need clear the list
  list.innerHTML = '';
  // create name
  createName('Film');
  //create list of people
  var table = document.createElement('table');
  table.class = 'film-data';
  list.appendChild(table);

  var content = '';
  content +=` 
    <tr>      
      <td><strong>Title: </strong></td>
      <td>${film.title}</td> 
    </tr>
    <tr>      
      <td><strong>Release date: </strong></td>
      <td>${film.release_date}</td> 
    </tr> 
    <tr>      
      <td><strong>Characters: </strong></td>
      <td>
        <ul class="characters-list">
  `;
  // get all people data
  if (allPeople === ''){
    allPeople = await getPeople(peopleUrl);
  }
  // all people url and name put in object {url: name} 
  var people_Url_Names = {};
  for (let i=0; i<allPeople.length; i++){
    url = allPeople[i].url
    console.log(url)
    people_Url_Names[url] = allPeople[i].name
  }
  // array with all people url from object {url: name}
  var peopleUrls = Object.keys(people_Url_Names)

  var characters = ''
  for (let i=0; i<film.characters.length; i++){
    // var person = await getItemData(film.characters[i]);
    // compare if url of character equal url in oblect then get name of character
    for (let j=0; j < peopleUrls.length; j++){
      if (film.characters[i] === peopleUrls[j]){
        characters +=`
          <li id="${film.characters[i]}">${people_Url_Names[peopleUrls[j]]}</li>
        `;
      }
    }
  }

  content += characters;
  // } else {
  //   console.log('Characters are not found.');
  // }

  content +=`
        </ul>
      </td> 
    </tr> 
    `;
  table.innerHTML = content;
}

function createName(name){
  var h2 = document.createElement('h2');
  h2.innerHTML = name;
  list.appendChild(h2);
}