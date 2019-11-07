module.exports = function (regs) {

    async function index(req, res) {
        var list = await regs.getRegistrations()
        res.render("index", {
            regnums: list
        })
    }
    async function addRegNumbers(req, res) {
        let regnumber = req.body.plate;
        if (regnumber === "") {
            req.flash("message", "reg can't be blank, Please enter a reg number!")
            return res.redirect('/')
        }
        await regs.addToList(regnumber)
        res.redirect('/');
    }

    async function filteredRegs(req, res) {
        let myregs = req.body.town;
        await regs.theFilter(myregs)
        console.log(await regs.theFilter(myregs));
        
        res.redirect('/')
    }

    function checkForRegex() {

        var regex = /[A-Z]{2}\s[0-9]{6}/g;
        var newReg = regex.test(param)

        var regex = /([A-Z]){2}\s+([0-9]){3}\s([0-9]){3}/g;
        var newReg2 = regex.test(param)

        if (!newReg && !newReg2) {
            req.flash("message", "invalid registration number");
            return false;
        }
    }
    async function clearButton(req, res) {
        await regs.resetData()
        res.redirect('/')
    }

    return {
        index,
        checkForRegex,
        addRegNumbers,
        clearButton,
        filteredRegs
    }
}