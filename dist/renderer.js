class Renderer {
    renderPlayers = function (data, templateId) {
        $("#players").empty()
        if (data !== 'error') {
            const source = $('#' + templateId).html()
            const template = Handlebars.compile(source)
            let newHTML = template({ players: data })
            $("#players").append(newHTML)
        }
        else {
            $("#players").append(`<p>Enter valid team name!</p>`)
        }
    }

}
