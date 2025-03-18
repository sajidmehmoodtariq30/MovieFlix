import React from 'react'

const MovieCard = ({ movie }) => {
    return (
        <li className='movie-card'>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <h3 className='mt-4'>{movie.title}</h3>
            <div className='content'>
                <span className='lang'>Language: {movie.original_language.toUpperCase()}</span>
                <span>|</span>
                <span className='year'>Year: {movie.release_date ? movie.release_date.split('-')[0]: 'N/A'}</span>
                <div className="rating">
                    <img src="star.svg" />
                    <span className='text-white'>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </li>
    )
}

export default MovieCard