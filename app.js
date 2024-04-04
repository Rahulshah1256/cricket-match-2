const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')
const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let database = null
const initializeDbAndServer = async () => {
  try {
    database = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('Server Is running on http://localhost:3000')
    })
  } catch (error) {
    console.log(`Data base Error is ${error}`)
    process.exit(1)
  }
}
initializeDbAndServer()
// API 1
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `select player_id as playerId, player_name as playerName, jersey_number as jerseyNumber
  , role from cricket_team`
  const getPlayersQueryResponse = await database.all(getPlayersQuery)
  response.send(getPlayersQueryResponse)
})

// API 2
app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const createPlayerQuery = ` insert into cricket_team(player_name, jersey_number, role) 
    values('${playerName}',${jerseyNumber},'${role}');`
  await database.run(createPlayerQuery)
  response.send('Player Added to Team')
})

// API 3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerDetailsQuery = `select player_id as playerId, player_name as playerName, jersey_number as jerseyNumber
    , role from cricket_team where player_id = ${playerId};`
  const playerDetailsQueryResponse = await database.get(getPlayerDetailsQuery)
  response.send(playerDetailsQueryResponse)
})
// API 4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const updatePlayerDetailsQuery = `update cricket_team set 
  player_name = '${playerName}' , jersey_number = ${jerseyNumber} , role = '${role}' 
  where player_id = ${playerId};`
  await database.run(updatePlayerDetailsQuery)
  response.send('Player Details Updated')
})
//API 5
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`
  await database.run(deletePlayerQuery)
  response.send('Player Removed')
})
module.exports = app
