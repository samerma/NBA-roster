const express = require('express')
const router = express.Router()
const urllib = require('urllib')

const json = {
    players: [],
    teams: [],
    dreamTeam: []
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
    const teams = teamsData.map(t => { return { teamName: t.urlName, teamId: t.teamId } })

    json.teams = teams
    //console.log(json.teams);
})


router.get('/teams/:teamName', function (req, res) {
    const teamName = req.params.teamName
    const team = json.teams.find(t => t.teamName == teamName)
    console.log(team);

    if (team == undefined) {
        res.send("error")
    }
    else {
        console.log(json.players);
        const players = json.players.filter(p => p.teamId == team.teamId)


        res.send(players)
    }
})

router.get('/dreamTeam', function (req, res) {
    res.send(json.dreamTeam)
})

router.post('/team', function (req, res) {
    console.log("Someone's trying to make a post request")
    console.log(req.body)
    let team = req.body
    json.teams.push(team)
    //console.log(json.teams);

    res.send("completed adding team")
})

router.post('/roster', function (req, res) {
    let player = req.body
    json.dreamTeam.push(player)
    console.log(json.dreamTeam);

    res.send("completed adding player to roster")
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
let p1 = new Player('samer', 'M', '1', '1', '4', 'G')
let p2 = new Player('hassan', 'spacetoon', '2', '2', '8', 'C')
json.dreamTeam.push(p1)
json.dreamTeam.push(p2)

module.exports = router