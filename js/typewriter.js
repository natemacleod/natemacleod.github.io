function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const type = async function (ftxt, ctxt, el) {
    while (ctxt !== ftxt) {
        ctxt = ftxt.substring(0, ctxt.length + 1)
        if (ctxt[ctxt.length - 1] === '\n') {
            ctxt = ctxt.substring(0, ctxt.length - 1) + "<br>"
            ftxt = "Hi.  <br>I'm Nate MacLeod."
        }
        el.innerHTML = '<span class="wrap">' + ctxt + '</span>'

        var waitTime = 250 - Math.random() * 100

        if (ctxt !== ftxt) {
            await sleep(waitTime)
        } else return "Completed typing"
    }
}

window.onload = async function () {
    var css = document.createElement("style")
    css.innerHTML = "#tr > .wrap { border-right: 0.08em solid #dedede }"
    document.body.appendChild(css)

    var element = document.getElementById('tr')
    await sleep(400)
    await type("Hi.  \nI'm Nate MacLeod.", "", element)
    await sleep(500)
    css.innerHTML = ""
    for (let i = 0; i < 4; i++) {
        await sleep(500)
        css.innerHTML = "#tr > .wrap { border-right: 0.08em solid #dedede }"
        await sleep(500)
        css.innerHTML = ""
    }
    css.remove()
}