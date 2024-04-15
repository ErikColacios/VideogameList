"use client"
import type { Videogame } from '../types/Videogame'
import GetVideogames from '../actions/getVideogames'
import { insertList } from '../actions/insertList'
import { useState, useEffect, Suspense, HTMLInputTypeAttribute } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import localFont from 'next/font/local'
import { getCovers } from '../actions/getCovers'
import Loading from './loading'
import VideogameCard from '../components/VideogameCard'

export default function Listavideojuegos() {

  const router = useRouter()
  let [videogameItems, setVideogameItems] = useState<Videogame[]>([])
  const [gameList, setGameList] = useState<Videogame[]>([])
  const [listName, setListName] = useState<string>("")
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")


function reload(){
  useEffect(()=>{
    const fetchVideogames = async ()=> {
      try{
        const covers = await getCovers(gameNameSearch)
        if(covers){
            setVideogameItems(covers)
        }
      }catch(error){
        console.log(error)
      }
    } 
    fetchVideogames()
  },[gameNameSearch])
}

reload()


  /**
   * Controls if the game exists in the list, and if it don't, then adds it
   * @param videogame 
   */
  function handleSetGameList (videogame:Videogame) {
    let listLength:number = gameList.length

    if(listLength===0){
      setGameList([...gameList, videogame]),
      setCountGames(countGames+1)
    }else {
      let gameFound = false;
      for(let i=0; i < listLength; i++) {
        if(gameList[i].name === videogame.name){
          Swal.fire({
            position: "top-end",
            title: "This game is already on the list",
            showConfirmButton: false,
            timer: 1500,
            backdrop: false,
          });

          gameFound=true;
          break;
        }
      } 
      if(!gameFound){
        setGameList([...gameList, videogame]),
        setCountGames(countGames+1)
      }
    }
  }


  /**
   * Deletes a videogame from the list searching its videogame_id
   * @param videogame_id 
   */
  function unselectGameList(videogame_id:number){
    setGameList(gameList.filter(item => item.id !== videogame_id))
    setCountGames(countGames-1)
  }

  /**
   * Creates a list using the "insertList" funcion
   * @returns
   */
  function createList() {
    if(listName==""){
      Swal.fire({
        position: "top-end",
        title: "Introduce a list name",
        showConfirmButton: false,
        timer: 1500,
        backdrop: false
      });
        return;
    }else {
        insertList(listName, gameList)
        Swal.fire({
          title: "List created successfuly!",
          icon: "success"
        })
        router.push("mylists")

    }
  }


  /**
   * Gets the search videogame name input and sets the state gameNameSearch
   */
  function handleSearchGame() {
    const searchGame:HTMLInputElement = document.getElementById("searchGame") as HTMLInputElement
    const name:string = searchGame.value;
    setGameNameSearch(name)
  }

  if(videogameItems.length == 0){
    console.log(videogameItems.length)
    return(
      <Loading/>
    )
  }

    return (
      <div className='flex bg-black text-white'>
        {/* Videogames */}
          <div className="w-5/6 flex justify-center flex-col p-2">
            <div className='flex justify-center mt-24 mb-8'>
              <p className="text-2xl lg:text-4xl 2xl:text-7xl">List name</p>
              <input type="text" placeholder='Super list' className='bg-black border-b border-white ml-8 w-96 outline-none text-2xl lg:text-4xl 2xl:text-5xl pl-4 mr-8' onChange={(e) => setListName(e.target.value)}/>
              <button onClick={()=> createList()} className='bg-green-500 rounded-lg text-xl w-32 hover:bg-green-600'>CREATE</button>
            </div>

            <div className='p-8 lg:p-16'>
              <div className='flex items-center pb-4'>
                <label htmlFor="searchGame">Search game</label>
                <input type="text" name="searchGame" id="searchGame" className='ml-8 w-96 bg-black outline-none border'/>
                <button className='bg-purple-500 p-1 rounded ml-2 hover:bg-purple-600' onClick={handleSearchGame}><img src="/staticImages/icon_search.png" alt="Search" className='w-5'/></button>
              </div>
              <div className='grid justify-center md:grid-cols-3 2xl:grid-cols-5 gap-12'>
                {videogameItems.map((videogame, index:number)=> (

                  <div key={index} className='group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer w-64 h-80 transition hover:scale-110' onClick={()=> handleSetGameList(videogame)}>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${videogame.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' />
                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                      <p className='text-lg '>{videogame.name}</p>
                    </div>
                    {/* <button className='w-full bg-green-400 hover:bg-green-600' onClick={()=> handleSetGameList(videogame)}>Add to your list</button> */}
                  </div>

                ))}
              </div>
            </div>


          </div> 
          {/* Sidebar - Games added */}
          <div className='bg-black flex flex-col text-white w-80 2xl:w-80 h-[50rem] 2xl:h-[55rem] p-4 right-0 border-2 border-white z-0 mt-20 mr-4 fixed'>
            <div className='flex'>
              <h3 className='text-2xl 2xl:text-2xl'>Games added</h3>
              <h3 className='text-2xl 2xl:text-2xl ml-10'>x{countGames}</h3>
            </div>
            <span className='bg-white w-full h-[1px] mt-2 mb-4'></span>
            <div className='overflow-scroll no-scrollbar'>
              {gameList.map((gameInList, index) => (
                  <div key={index} className='flex items-center mb-3 w-full relative'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 h-12'/>
                    <p className='text-md ml-4'>{gameInList.name}</p>
                    <button className='ml-4 flex items-center'><img src="/staticImages/icon_remove.png" alt="Remove icon" className='w-5 absolute right-0' onClick={()=> unselectGameList(gameInList.id)}/></button>
                  </div>
              ))}
            </div>
          </div>
      </div>
      
    )
  
}