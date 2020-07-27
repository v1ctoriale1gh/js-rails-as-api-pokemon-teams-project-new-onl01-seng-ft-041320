const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


function deletePokemon(pokemonId){
    fetch(POKEMONS_URL + "/" + `${pokemonId}`, {method: "DELETE"})
    .then(function(response){
        return response.json()
    })
    .then(function(pokemonInfo){
        document.querySelector(`[data-pokemon-id="${pokemonInfo.data.id}"]`).parentElement.remove()
        alert(`${pokemonInfo.data.attributes.nickname} the ${pokemonInfo.data.attributes.species} has been released`)
    })

};

function postPokemon(trainerId) {
    configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
            "trainer id": trainerId
        })
      };

     return fetch(POKEMONS_URL, configurationObject)
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
          if (!!json.data){
            let trainerCard = document.querySelector(`[data-id="${json.data.relationships.trainer.data.id}"]`)
            let pokemonList = trainerCard.querySelector('ul')
            pokemonList.innerHTML += `
            <li>${json.data.attributes.nickname} (${json.data.attributes.species}) <button class="release" data-pokemon-id="${json.data.id}">Release</button></li> `
          } else {
              alert(json.message)
          }

      })
      .catch(errors => alert(errors))
    
};

function addOrReleasePokemon(e){
    if (e.target.className == "add-pokemon") {
        let trainerId = e.target.dataset.trainerId
        postPokemon(trainerId);
    } else if (e.target.className == "release") {
        pokemonId = e.target.dataset.pokemonId
        deletePokemon(pokemonId);
    }
};

function fetchPokemon() {
    fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(json => {

        json.data.forEach( function makeTrainerCard(trainerInfo) {
            document.querySelector('main').innerHTML += `
            <div class="card" data-id="${trainerInfo.id}"><p>${trainerInfo.attributes.name}</p>
            <button class='add-pokemon' data-trainer-id="${trainerInfo.id}">Add Pokemon</button>
            <ul class="pokemon-list">
            </ul>
            </div>`

        });

        json.included.forEach(function addPokemonToTrainerCard(pokemonInfo) {
            let trainerCard = document.querySelector(`[data-id="${pokemonInfo.relationships.trainer.data.id}"]`)
            let pokemonList = trainerCard.querySelector('ul')
            pokemonList.innerHTML += `
            <li>${pokemonInfo.attributes.nickname} (${pokemonInfo.attributes.species}) <button class="release" data-pokemon-id="${pokemonInfo.id}">Release</button></li>`
        });

    })
    .catch(errors => alert(errors))};

    document.addEventListener("DOMContentLoaded", function (){
        fetchPokemon();
        document.querySelector('main').addEventListener('click', addOrReleasePokemon);
    });