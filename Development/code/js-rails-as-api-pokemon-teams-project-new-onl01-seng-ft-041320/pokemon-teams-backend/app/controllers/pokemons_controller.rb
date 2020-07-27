class PokemonsController < ApplicationController

    def index
        pokemons = Pokemon.all 
        options = {
            include: [:trainer]
        }
        render json: PokemonSerializer.new(pokemons, options)
    end

    def create
        trainer = Trainer.find_by(id: params["trainer id"])
        if trainer.pokemons.count < 6
            pokemon = Pokemon.create(nickname: Faker::Name.first_name, species: Faker::Games::Pokemon.name, trainer_id: trainer.id)
            options = {
                include: [:trainer]
            }
            render json: PokemonSerializer.new(pokemon, options)
        else
            render json: {message: 'Already have 6 pokemon, release one first'}
        end
    end

    def destroy
        options = {
            include: [:trainer]
        }
        pokemon = Pokemon.find_by(id: params[:id])
        pokemon.destroy
        render json: PokemonSerializer.new(pokemon, options)
    end

end