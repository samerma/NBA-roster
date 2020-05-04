const fetchPlayers = function () {
    let input = $("input").val()

    $.get(`teams/${input}`, function (data) {
        $("#players").empty()
        for (let player of data) {
            $("#players").append(`<p>${player}</p>`)
        }
    })
}