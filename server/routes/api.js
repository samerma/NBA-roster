const express = require('express')
const router = express.Router()
const urllib = require('urllib')

const json = {
    data: [],
    teams: []
}

//get players
urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function (err, data, res) {
    if (err) {
        throw err; // you need to handle error
    }
    const playersData = JSON.parse(data).league.standard
    const players = playersData.filter(p => p.isActive == true)
        .map(p => {
            const player = new Player(p.firstName, p.lastName, p.personId, p.teamId, p.jersey, p.pos)
            return player
        })
    json.players = players
    //console.log(json.players);
})
//get teams
urllib.request('http://data.nba.net/10s/prod/v1/2018/teams.json', function (err, data, res) {
    if (err) {
        throw err; // you need to handle error
    }
    const teamsData = JSON.parse(data).league.standard
    const teams = teamsData.map(t => { return { name: t.urlName, id: t.teamId } })

    json.teams = teams
    //console.log(json.teams);
})


router.get('/teams/:teamName', function (req, res) {
    const teamName = req.params.teamName
    const team = json.teams.find(t => t.name == teamName)
    if (team == undefined) {
        res.send("error")
    }
    else {
        const players = json.players.filter(p => p.teamId == team.id)
        res.send(players)
    }
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
module.exports = router