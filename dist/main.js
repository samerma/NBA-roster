const renderPlayers = function (data) {
    $("#players").empty()
    if (data !== 'error') {
        const source = $('#player-template').html()
        const template = Handlebars.compile(source)
        let newHTML = template({ players: data })
        $("#players").append(newHTML)
    }
    else {
        $("#players").append(`<p>Enter valid team name!</p>`)
    }
}
const fetchPlayers = function () {
    let input = $("input").val()
    if (input == '')
        input = 'empty'
    $.get(`teams/${input}`, function (data) {
        renderPlayers(data)
    })
}
const fetchDreamTeam = function () {
    $.get('dreamTeam', function (data) {
        renderPlayers(data)
    })
}

$("#dream-team-btn").on('click', function () {
    fetchDreamTeam()
})