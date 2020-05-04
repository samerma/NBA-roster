const express = require('express')
const app = express()
const path = require('path')
const urllib = require('urllib')
//const player = require('./player.js')

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.get('/teams/:teamName', function (req, response) {
    const teamName = req.params.teamName
    try {
        //first get team id from the name
        urllib.request('http://data.nba.net/10s/prod/v1/2018/teams.json', function (err, data, res) {
            if (err) {
                throw err; // you need to handle error
            }
            const teams = JSON.parse(data).league.standard
            const teamIndex = teams.findIndex(t => t.urlName == teamName)
            if (teamIndex == -1) {
                response.send("error")
                return
            }
            const teamId = teams[teamIndex].teamId
            // now get players with this team id
            urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function (err, data, res) {
                if (err) {
                    throw err; // you need to handle error
                }
                const playersData = JSON.parse(data).league.standard
                const players = playersData.filter(p => p.isActive == true && p.teamId == teamId).map(p => {
                    const player = new Player(p.firstName, p.lastName, p.personId, p.teamId, p.jersey, p.pos)
                    return player
                })
                response.send(players)
            })
        })
    } catch (e) {
        response.send({ e })
    }
})


const port = 3000
app.listen(port, function () {
    console.log("port:" + port);

})

class Player {
    constructor(firstName, lastName, personId, teamId, jersey, pos) {
        this.firstName = firstName
        this.lastName = lastName
        this.personId = personId
        this.teamId = teamId
        this.jersey = jersey
        this.pos = pos
    }
}




/* const getTeamId = function (name) {
    urllib.request('http://data.nba.net/10s/prod/v1/2018/teams.json', function (err, data, res) {
        if (err) {
            throw err; // you need to handle error
        }
        const teams = JSON.parse(data).league.standard
        const teamIndex = teams.findIndex(t => t.urlName == name)
        console.log(teams[teamIndex].teamId);
        return teams[teamIndex].teamId
    })
}
const getPlayers = function () {
    urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function (err, data, res) {
        if (err) {
            throw err; // you need to handle error
        }
        const playersData = JSON.parse(data).league.standard
        const players = playersData.filter(p => p.isActive == true).map(p => {
            const player = new Player(p.firstName, p.lastName, p.personId, p.teamId, p.jersey, p.pos)
            return player
        })
        return players
    })
} */