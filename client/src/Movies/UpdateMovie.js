import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const initalValue = {
  title: '',
  director: '',
  metascore: null,
  stars: [],
};

const UpdateMovie = ({ movieList, setMovieList }) => {
  const location = useLocation();
  const params = useParams();
  const { push } = useHistory();
  const [movieInput, setMovieInput] = useState(initalValue);

  useEffect(() => {
    if (location.state) {
      setMovieInput(location.state);
    } else {
      axios
        .get(`http://localhost:5000/api/movies/${params.id}`)
        .then((res) => {
          setMovieInput(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onChange = (e) => {
    e.persist();
    setMovieInput({ ...movieInput, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/movies/${movieInput.id}`, movieInput)
      .then((res) => {
        const newMovies = movieList.map((movie) => {
          if (movie.id === res.data.id) {
            return res.data;
          }
          return movie;
        });
        setMovieList(newMovies);
        push(`/movies/${movieInput.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type='text'
        name='title'
        placeholder='Title'
        value={movieInput.title}
        onChange={onChange}
      />
      <input
        type='text'
        name='director'
        placeholder='Director'
        value={movieInput.director}
        onChange={onChange}
      />
      <input
        type='text'
        name='metascore'
        placeholder='Metascore'
        value={movieInput.metascore}
        onChange={onChange}
      />

      <button>Update movie</button>
    </form>
  );
};

export default UpdateMovie;
