const express = require('express')
const router = express.Router()
const urllib = require('urllib')
const Player = require('./../../classes/player.js')

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
            const player = new Player(p.firstName, p.lastName, p.personId, p.teamId, p.jersey, p.pos, false, p.heightMeters, p.weightKilograms)
            return player
        })
    json.players = players
})
//get teams
urllib.request('http://data.nba.net/10s/prod/v1/2018/teams.json', function (err, data, res) {
    if (err) {
        throw err; // you need to handle error
    }
    const teamsData = JSON.parse(data).league.standard
    const teams = teamsData.map(t => { return { teamName: t.urlName, teamId: t.teamId } })
    json.teams = teams
})


router.get('/teams/:teamName', function (req, res) {
    const teamName = req.params.teamName
    const team = json.teams.find(t => t.teamName == teamName)

    if (team == undefined) {
        res.send("error")
    }
    else {
        const players = json.players.filter(p => p.teamId == team.teamId)
        res.send(players)
    }
})

router.get('/dreamTeam', function (req, res) {
    res.send(json.dreamTeam)
})
router.get('/teamsList', function (req, res) {
    const teamsList = json.teams.map(t => {
        return t.teamName
    })
    res.send(teamsList)
})

router.post('/team', function (req, res) {
    console.log("Someone's trying to make a post request")
    console.log(req.body)
    let team = req.body
    json.teams.push(team)
    res.send("completed adding team")
})

router.post('/roster', function (req, res) {
    const player = req.body
    const exists = json.dreamTeam.findIndex(p => p.personId == player.personId)
    const pIndex = json.players.findIndex(p => p.personId == player.personId)
    if (exists === -1) {
        json.players[pIndex].isDT = true
        json.dreamTeam.push(player)
        res.send("success")
    }
    else {
        res.send("failure")
    }
})

router.delete('/roster/:personId', function (req, res) {
    const personId = req.params.personId
    const i = json.dreamTeam.findIndex(p => p.personId == personId)
    const j = json.players.findIndex(p => p.personId == personId)
    json.dreamTeam.splice(i, 1)
    json.players[j].isDT = false
    res.send('deleted ' + personId)
})


module.exports = router