const renderer = new Renderer()

const fetchPlayers = function () {
    let input = $("input").val()
    if (input == '')
        input = 'empty'
    $.get(`teams/${input}`, function (data) {
        renderer.renderPlayers(data)
    })
}
const fetchDreamTeam = function () {
    $.get('dreamTeam', function (data) {
        renderer.renderPlayers(data)
    })
}

$("#dream-team-btn").on('click', function () {
    fetchDreamTeam()
})

$('#players').on('click', '.add-player-btn', function () {
    const $player = $(this).closest('.player')
    const data = {}
    data.firstName = $player.find('.name').text().split(' ')[0]
    data.lastName = $player.find('.name').text().split(' ')[1]
    data.personId = $player.data().personId
    data.teamId = $player.data().teamId
    data.jersey = $player.find('.jersey').text()
    data.pos = $player.find('.pos').text()
    console.log(data)
    $.post('roster', data, function (res) {
        console.log(res);
    })
})