import React, {useEffect, useState} from 'react';
import Tmbdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css'
import FeaturedMovie  from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {


  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeatureData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async() =>  {
      // Pegando a lista
      let list = await Tmbdb.getHomeList();
      setMovieList(list)
      
      // Pegando o Featured
      let originals = list.filter(i=> i.slug  === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmbdb.getMovieInfo(chosen.id, 'tv')
      setFeatureData(chosenInfo)
    }

    loadAll();
  }, []);

  useEffect(() =>{
    const scrollListener = () => {
      if(window.scrollY > 20) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }

    }

    window.addEventListener('scroll',scrollListener);

    return () => {
      window.removeEventListener('scroll',scrollListener);
    }

  }, []);

  return(
    <div className="page">

      <Header black={blackHeader}/>

    {featuredData &&
      <FeaturedMovie item={featuredData}/>
    }
      <section className="lists">
        {movieList.map((item,key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Projeto clone netflix feito em <span>react</span>
      </footer>

        {movieList.length <= 0 &&
          <div className="loading">
            <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando"></img>
          </div>
        }
    </div>
  )
}