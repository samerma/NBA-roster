const renderer = new Renderer()

const fetchPlayers = function () {
    let input = $("input").val().toLowerCase()
    if (input == '')
        input = 'empty'
    $.get(`teams/${input}`, function (data) {
        renderer.renderPlayers(data, 'player-template')
    })
}

const fetchDreamTeam = function () {
    $.get('dreamTeam', function (data) {
        renderer.renderPlayers(data, 'dream-team-template')
    })
}

$("#dream-team-btn").on('click', function () {
    fetchDreamTeam()
})

$('#players').on('click', '.add-player-btn', function () {
    const $player = $(this).closest('.player')
    const data = new Player()
    data.firstName = $player.find('.name').text().split(' ')[0]
    data.lastName = $player.find('.name').text().split(' ')[1]
    data.personId = $player.data("personid")
    data.teamId = $player.data("teamid")
    data.jersey = $player.find('.jersey').text()
    data.pos = $player.find('.pos').text()
    data.height = $player.find('.height').text()
    data.weight = $player.find('.weight').text()
    //animations
    $player.animate({
        opacity: 0.5,
    }, 500, function () {
        $player.find('button').prop('disabled', true)
    })
    //
    $.post('roster', data, function (res) {
        console.log(res);
        if (res == 'failure') {
            alert('already added')
        }
    })
})

$('#players').on('click', '.remove-player-btn', function () {
    const $player = $(this).closest('.player')
    const personId = $player.data("personid")
    $.ajax({
        url: `roster/${personId}`,
        method: "DELETE",
        success: function (res) {
            fetchDreamTeam()
        }
    })
})

$('#players').on('mouseenter', '.image-container', function () {
    $(this).find('.stats').show(500)
})
$('#players').on('mouseleave', '.image-container', function () {
    $(this).find('.stats').hide(500)
})

//auto complete function
$(function () {
    let teams = ["hawks", "celtics", "bullets", "nets", "hornets", "bulls", "cavaliers", "mavericks",
        "nuggets", "pistons", "warriors", "rockets", "pacers", "clippers", "lakers",
        "grizzlies", "heat", "bucks", "timberwolves", "pelicans", "knicks", "thunder", "magic",
        "sixers", "suns", "blazers", "kings", "spurs", "raptors", "jazz", "wizards"].map(t => {
            return t.toUpperCase()
        })
    $('input').autocomplete({
        source: teams,
        appendTo: "#auto-complete",
    })
    $.ui.autocomplete.filter = function (array, term) {//overide filter method to only match from biginning of word
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        })
    }
})